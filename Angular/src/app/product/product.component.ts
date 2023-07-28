import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from '../Model/ProductModel';
import { AuthService } from '../Services/auth.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import * as alertifyjs from 'alertifyjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: object) => jsPDF;
  }
}
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  formValue !: FormGroup
  showAdd: boolean = false;
  showUpdate: boolean = false;
  productObj: ProductModel = new ProductModel();
  CategoryList: any
  responseData: any
  multiSelectValue: any
  ctrl = new FormControl();
  UserId: any
  date: any
  Mode: any
  ProductList: any
  dataSource: any
  EditProductID: any
  createdby:any
  createdDate:any
  selectedValue: any[] = [];
  imgUrl: any
  file: any
  

  @ViewChild('imageInput') imageInput: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator
  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild('content', { static: true }) content!: ElementRef; 
  displayedColumns: string[] = ['image', 'name', 'category', 'quantity', 'manufacturing_Date','price','Action'];
  headers: any[] = ['name', 'categoryName', 'quantity', 'manufacturing_Date','price'];
  colors: string[] = ['Red', 'Blue', 'Black', 'Green', 'Yellow'];
  constructor(private formBuilder: FormBuilder, private service: AuthService, public datepipe: DatePipe,private _liveAnnouncer: LiveAnnouncer) { }
  ngOnInit(): void {
    this.formValue = this.formBuilder.group({

      Image: [''],
      Name: ['', Validators.required],
      Category: [''],
      Description: ['', Validators.required],
      Quantity: ['', [Validators.required, 
        Validators.pattern('^0*(?:[1-9][0-9]?|100)$')]],
      Manufacturing_Date: ['', Validators.required],
      IsOutofstock: [''],
      Color: ['', Validators.required],
      Price: ['', Validators.required]
    })
    this.UserId = localStorage.getItem('id')
    this.date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    this.service.CategotyList().subscribe(data => {
      this.responseData = data
      this.CategoryList = this.responseData.data
    })
    this.GetProductList()
  }


  exportToCSV(data: any) {
    if(data != null){
      const csv = data.filteredData.map((row: any) => {
        const formattedRow = { ...row }; // Create a copy of the row to avoid modifying the original data
      
        // Check if the field 'manufacturing_Date' exists and is a valid date
        if (row.hasOwnProperty('manufacturing_Date')) {
          const date = new Date(row['manufacturing_Date']);
          // Format the date as per your requirement, for example:
          const formattedDate = `${date.toLocaleDateString()}`;
          formattedRow['manufacturing_Date'] = formattedDate;
        }
      
        return this.headers.map((fieldName) => JSON.stringify(formattedRow[fieldName])).join(',');
      });
      
      csv.unshift(this.headers.join(','));
      const csvArray = csv.join('\r\n');
    
      const a = document.createElement('a');
      const blob = new Blob([csvArray], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
    
      a.href = url;
      a.download = 'myFile.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
    else{
      alertifyjs.error('No Data Found')
    }   
  }

  public SavePDF(data:any):void{    
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    let startY = 15; // Initial y-position for the first page
    const lineHeight = doc.getLineHeight();

    const tableData = data.filteredData.map((row: any) => [
      row.name,
      row.categoryName,
      row.quantity,
      new Date(row.manufacturing_Date).toLocaleDateString(),
      row.price,
    ]);

    const totalPages = Math.ceil((tableData.length * lineHeight) / pageHeight);

    // Function to add page number
    const addPageNumber = (pageNumber: number) => {
      doc.text(`Page ${pageNumber}/${totalPages}`, doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
    };

    let currentPage = 1;
    let currentIndex = 0;

    while (currentIndex < tableData.length) {
      if (currentPage > 1) {
        doc.addPage();
        startY = 15; // Reset the y-position for the new page
      }

      doc.autoTable({
        head: [this.headers],
        body: tableData.slice(currentIndex, currentIndex + Math.floor((pageHeight - startY) / lineHeight)),
        startY: startY,
      });

      addPageNumber(currentPage);

      currentPage++;
      currentIndex += Math.floor((pageHeight - startY) / lineHeight);
      startY = 15; // Reset the y-position for the next page
    }

    doc.save('output.pdf');
    
  } 

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }


  GetProductList() {
    this.Mode = "S"
    this.service.GetProductList(this.Mode).subscribe(res => {
      this.responseData = res;
      this.ProductList = this.responseData.data
      this.dataSource = new MatTableDataSource<ProductModel>(this.ProductList);      
      this.dataSource.paginator = this.paginator
    })
  }

  AddProductBtn() {
    this.imgUrl = ''
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
    this.multiSelectValue = []
    document.getElementById("categoryValidation")?.setAttribute("class", "d-none")
    document.getElementById("imgvalidation")?.setAttribute("class", "d-none")
  }
  
  onImageSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];
    this.file = file
    
    if (this.file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const target = e.target!;
        $('#leafImg').attr('src', target.result).width(80).height(80);
      };
      reader.readAsDataURL(this.file);
    }
    this.imgUrl = this.file.name
  }



  PostProductDetails() {    
    debugger
    if(this.formValue.value.Image == null){
      document.getElementById("imgvalidation")?.setAttribute("class", "d-block text-danger")
    }
    else{
      document.getElementById("imgvalidation")?.setAttribute("class", "d-none")
    }
      
    if(this.multiSelectValue == '' ){
      document.getElementById("categoryValidation")?.setAttribute("class", "d-block text-danger")
    }
    else{
      document.getElementById("categoryValidation")?.setAttribute("class", "d-none")

    }
    if (this.formValue.value.IsOutofstock == null) {
      this.formValue.value.IsOutofstock = false;
    }
    if (this.formValue.valid) {

      const formData = new FormData();
      formData.append('Mode', "I");
      formData.append('Name', this.formValue.value.Name);
      formData.append('Category', this.multiSelectValue.join(',').toString());
      formData.append('Description', this.formValue.value.Description);
      formData.append('Quantity', this.formValue.value.Quantity);
      formData.append('Manufacturing_Date', this.formValue.value.Manufacturing_Date);
      formData.append('IsOutofstock', this.formValue.value.IsOutofstock);
      formData.append('Color', this.formValue.value.Color);
      formData.append('Price', this.formValue.value.Price);
      formData.append('IsActive', JSON.stringify(true));
      formData.append('CreatedBy', this.UserId);
      formData.append('CreatedDate', this.date);
      formData.append('ModifiedBy', this.UserId);
      formData.append('ModifiedDate', this.date);
      formData.append('image', this.formValue.value.Image);
      formData.append('file', this.file);

      this.service.AddProduct(formData).subscribe(res => {
        this.responseData = res
        if(this.responseData.success == true) {
          alertifyjs.success(this.responseData.message);
          let close = document.getElementById("close")
          close?.click();
          this.formValue.reset();
          this.GetProductList()
          this.file =''
          
        }
        else{
          alertifyjs.error(this.responseData.message)
        }
      })
    }
    else {
      this.ValidateForm(this.formValue)
    }
  }
  editProduct(id: any) {
    this.formValue.reset()
    document.getElementById("categoryValidation")?.setAttribute("class", "d-none")
    document.getElementById("imgvalidation")?.setAttribute("class", "d-none")

    if(id != null){
      this.EditProductID = id
      this.showUpdate = true
      this.showAdd = false
      this.Mode = "G"
      this.service.GetProductById(id,this.Mode).subscribe(res =>{
        this.responseData = res
        let data = this.responseData.data[0]
        this.filterMultiple(data.category.split(","))
        this.imgUrl = data.image;
        this.formValue.controls['Name'].setValue(data.name);
        this.formValue.controls['Description'].setValue(data.description);
        this.formValue.controls['Quantity'].setValue(data.quantity);
        this.formValue.controls['Manufacturing_Date'].setValue(new Date(data.manufacturing_Date).getFullYear().toString() + '-' + (new Date(data.manufacturing_Date).getMonth() + 1).toString().padStart(2, "0") + '-' + new Date(data.manufacturing_Date).getDate().toString().padStart(2, "0"));
        this.formValue.controls['IsOutofstock'].setValue(data.isOutofstock);
        this.formValue.controls['Color'].setValue(data.color);
        this.formValue.controls['Price'].setValue(data.price);
        this.createdby = data.createdBy;
        this.createdDate = data.createdDate;
        this.selectedValue = data.category.split(",");
        this.multiSelectValue =[]
        var size = this.selectedValue.length;
        for (let i = 0; i < size; i++) {
          this.multiSelectValue.push(Number(this.selectedValue[i]));
          
        }
        
      })
    }
    else{
      this.showAdd = true;
      this.showUpdate = false
    }
    this.imgUrl = ''
  }

  UpdateProduct() {    
    if(this.multiSelectValue == '' ){
      document.getElementById("categoryValidation")?.setAttribute("class", "d-block text-danger")
    }
    else{
      document.getElementById("categoryValidation")?.setAttribute("class", "d-none")

    }
    if (this.formValue.value.IsOutofstock == null) {
      this.formValue.value.IsOutofstock = false;
    }
    if (this.formValue.valid) {

      const formData = new FormData();
      formData.append('Mode', "U");
      formData.append('id', this.EditProductID);
      formData.append('Name', this.formValue.value.Name);
      formData.append('Category', this.multiSelectValue.join(',').toString());
      formData.append('Description', this.formValue.value.Description);
      formData.append('Quantity', this.formValue.value.Quantity);
      formData.append('Manufacturing_Date', this.formValue.value.Manufacturing_Date);
      formData.append('IsOutofstock', this.formValue.value.IsOutofstock);
      formData.append('Color', this.formValue.value.Color);
      formData.append('Price', this.formValue.value.Price);
      formData.append('IsActive', JSON.stringify(true));
      formData.append('CreatedBy', this.UserId);
      formData.append('CreatedDate', this.date);
      formData.append('ModifiedBy', this.UserId);
      formData.append('ModifiedDate', this.date);
      if(this.formValue.value.Image != null){
        formData.append('ProfilePic', '');
        formData.append('file', this.file);
      }
      else{
        // this.formValue.value.Image = this.imgUrl;
        formData.append('ProfilePic', this.imgUrl);
      }


      this.service.UpdateProduct(formData).subscribe(res => {
        this.responseData = res
        if(this.responseData.success == true){
          alertifyjs.success(this.responseData.message);
          let close = document.getElementById("close")
          close?.click();
          this.formValue.reset();
          this.GetProductList()
        }
        else{
          alertifyjs.error(this.responseData.message)
        }
      })
    }
    else {
      this.ValidateForm(this.formValue)
    }
  }

  DeleteProduct(id: any) {
    if (confirm('Are you sure you want to delete this employee')) {
      this.Mode = "D"
      this.service.DeleteProduct(id, this.Mode).subscribe(data => {
        this.responseData = data
        this.GetProductList()
        alertifyjs.success(this.responseData.message);
      })
    }
  }

  filterMultiple(event: Event) {
    this.multiSelectValue = event
    

  }

  private ValidateForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      }
      else if (control instanceof FormGroup) {
        this.ValidateForm(control)
      }
    })
  }

  announceSortChange(sortState: Sort) {    
    if (sortState.direction) {
      this.dataSource.sort = this.sort;
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.dataSource.sort = this.sort;
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

}

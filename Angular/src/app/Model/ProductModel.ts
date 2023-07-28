export class ProductModel{
    id: number = 0;
    Mode:string="";
    image !: any;
    Name: string = "";
    Category: string = "";
    Description: string = "";
    Quantity: number = 0;
    Manufacturing_Date: Date = new Date();
    IsOutofstock: boolean = false;
    Color: string = "";
    Price: number = 0;
    IsActive:boolean=true;
    CreatedBy: string = '';
    CreatedDate: Date = new Date();
    ModifiedBy: string = '';
    ModifiedDate: Date = new Date();
}
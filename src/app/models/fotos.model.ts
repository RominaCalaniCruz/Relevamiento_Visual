import { Timestamp } from "firebase/firestore";

export interface Fotos{
    userID: string,
    url:string,
    categoria:string,
    autor: string,
    cantLikes:number,
    fecha: Timestamp,
    arrayUsuarios: string[]
}
export class Codificar {
    
    static codificarDiagonal(cadena: string):string {
        let nuevaCadena = '';
        for(let c of cadena){
            if(c == '/'){
                c = ',';
            }
            nuevaCadena = nuevaCadena + c;
        }
        return nuevaCadena;
    }
}
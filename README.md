# mmo-replacer

Reemplaza marcadores de posición del tipo %\<expression\>% en una cadena con los valores obtenidos de un objeto de contexto.
\<expression\> puede contener cualquier expresión válida en javascript.
El doble %(%%) hace de escape para la cadena %.

## uso
```ts
    import * as replacer from 'mmo-replace'
```

## Función-Objeto `replacer`
Reemplaza los marcadores de posición en una cadena.
```ts
replace(sandbox: object, message: string, options: InspectOptions | boolean=false) {
```
* `sandbox`: Objeto con la información a insertar. 
* `message`: Mensaje con los marcadores de posición para insertar la información de context.
* `options`: Por omisión o false el resultado se convierte en cadena mediante la función asignada a `replacer.stringifier`; en otro caso se aplicará la asignada a `replacer.inspector`, con las optiones indicadas, que de ser `true`, serán las establecidas por omisión.
* **retorna**: Cadena con marcadores reemplazados.

Nota: Existen dos modos de convertir en cadena los datos del objeto de contexto:
* **modo inspector**(*inspector*): Si se pasan opciones o se indica `true`.
* **modo cadenificador**(*stringifier*): Cuando se omiten las opciones o se pasa `false`.

### Método miembro `replacer.stream`
Devuelve un stream que permite canalizar una entrada y reemplazar los marcadores para la salida.
```ts
    replacer.stream(sandbox: object, options?: InspectOptions | boolean = false): stream.Transform 
```
* `sandbox`: Objeto con datos. 
* `options`: Como en la función replacer.     
* **retorna**: stream.Transform.

### Propiedad miembro `inspector`
Función encargada de realizar las inspeciones modo inspector mediante el paso opciones a `replacer`.
```ts
replacer.inspector: (object:any, options: util.InspectOptions); 
```
P.O. la función utilizada es `util.inspect`.
### Propiedad miembro `stringifier`
Función encargada de realizar las inspeciones cuando NO se pasan opciones a `replacer`.
```ts
replacer.strinfigier: (object:any):string; 
```
P.O. la función utilizada devuelve el resultado de aplicar el método `toString` al objeto pasado.

### Método miembro `replacer.customizeInspector`
Asigna función personalizada a los objetos generados por la clase indicada para realizar las inspecciones modo inspector. 
```ts
replacer.customizeInspector(Class: TClass, inspect: (this:any, options?:InspectOptions)=>string)
``` 
* `Class`: Clase a la que se quiere asignar un inpector tipo util.inspect personalizado. 
* `inspect`: Función que inspeccionará los objetos de la clase devolviéndolos como una cadena. Asume que `this` es el objeto a inspeccionar.
### Método miembro `replacer.customizeStringifier`
Asigna función personalizada a los objetos generados por la clase indicada para realizar las inspecciones modo cadenificador. 
```ts
replacer.customizeStringifier(Class: TClass, stringify: (this:any)=>string)
``` 
* `Class`: Clase a la que se quiere asignar un inpector tipo util.inspect personalizado. 
* `stringify`: Función cadenificará los objetos de la clase devolviéndolos como una cadena. Asume que `this` es el objeto a cadenificar.

### Método miembro `replacer.inspect`
Ejecuta la función de inspección(`replacer.inspector`) o la personalizada con `replacer.customizeInspector`(si la tiene) sobre el objeto pasado.
```ts
replacer.inspect(object:any, options?:inspectOptions)
``` 
### Método miembro `replacer.stringify`
Ejecuta la función de cadenificación(`replacer.stringifier`) o la personalizada con `replacer.customizeStringifier`(si la tiene) sobre el objeto pasado.
```ts
replacer.stringify(object:any)
``` 


## Ejemplo
Partiendo del fichero de entrada:<br><br>
*demo.txt*
```
Mi nombre es %name%: %fullname()%; y soy el puto amo.
Y este es my fiel empleado: %empl%.
```

Tras ejecutar el ejemplo:

```ts
import replacer from '../index';
import * as fs from 'fs';

class Employed {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age
    }
}

//Inspector personalizado para Employed
replacer.customizeInspector(Employed, function () {
    return this.name + '(\n\t' + this.age + '\n)';
})
//Cadenificador personalizado para Employed
replacer.customizeStringifier(Employed, function () {
    return this.name + '(' + this.age + ' years old)';
})

const sandboss = {
    name: "Pedro",
    surname: "Julian",
    fullname: function () { return sandboss.surname + ', ' + sandboss.name },
    banks: {
        Santanque: {
            balance: 50000
        },
        Bilbado: {
            balance: 60000
        }
    },
    empl: new Employed("Julito", 33)
}

console.log(replacer(sandboss, "Empleado(modo inspector personalizado): %empl%", {}));
console.log(replacer(sandboss, "Empleado(mode cadenificador personalizado): %empl%"));

console.log(replacer(sandboss, "Ejemplo de expresión: Me llamo %name + ' ' + surname% y soy el jefe."));
console.log(replacer(sandboss, "Ejemplo de expresión con función: Mi nombre es %surname + '; ' +  fullname()% y sigo siendo el rey"));
console.log(replacer(sandboss, "Bancos(modo inspector): %banks%", {
    compact: false
}));
console.log(replacer(sandboss, "Bancos(modo cadenificador): %banks%"));

// Stream con marcadores de posición
const readable = fs.createReadStream('./path/to/demo.txt', 'utf8');
// Stream para salida.
const writable = fs.createWriteStream('./path/to/demo.replaced.txt', 'utf8');

readable.pipe(replacer.stream(sandboss)).pipe(writable)
```
Tendremos en consola: 
```
Empleado(modo inspector personalizado): Julito(
	33
)
Empleado(mode cadenificador personalizado): Julito(33 years old)
Ejemplo de expresión: Me llamo Pedro Julian y soy el jefe.
Ejemplo de expresión con función: Mi nombre es Julian; Julian, Pedro y sigo siendo el rey
Bancos(modo inspector): {
  Santanque: {
    balance: 50000
  },
  Bilbado: {
    balance: 60000
  }
}
Bancos(modo cadenificador): [object Object]
```` 

y el fichero
*demo.replaced.txt*
```
Mi nombre es Pedro: Julian, Pedro; y soy el puto amo.
Y este es my fiel empleado: Julito(33 years old).
```
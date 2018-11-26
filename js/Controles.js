// Recibe los datos,los valida, calcula los datos faltantes, actualiza la información en Section Datos.
var variables = {
    bps: 0,
    bw: 0,
    periodo: 0,
    frecuencia: 0,
    numArm: 0,
    f: 0,
    dc:0,
    decimal:0,
    gt: 0,
    datosCorrectos:false
};
function llegadaDatos() {
    // recibe los datos que el usuario introdujo 
    variables.datosCorrectos=true ;
    //prueba(); // para mostrar la las graficas con datos quemados
    variables.bps = document.getElementById("bps").value;///Atrapo el contenido de la caja de texto con ID "text1"
    variables.bw = document.getElementById("anchoBanda").value;
    var caracter = document.getElementById("carac").value;
    validarDatos(caracter,variables.bps,variables.bw);
    calcularVariables(caracter);


}
function validarDatos(caracter,bps,anchoBanda) {
    // Revisa que los valores de los usuarios sean correctos
    if (caracter.length > 1) {
        alert("El caracter debe ser de maximo 1");
        variables.datosCorrectos = false;
    }
    else if(caracter.length ==0){
        alert("Debe colocar algún dato en la casilla del caracter");
        variables.datosCorrectos = false;
    }
    else if(((anchoBanda*1000)/(1/(8/bps)))>100){
            alert("Debe disminuir los datos del ancho de banda o aumentar los bps para que el numero de armonicos sea menor o igual a 100\nConsidere lo indicado en las instrucciones\nEl numero de armonicos fue "+ ((anchoBanda*1000)/(1/(8/bps))));
            variables.datosCorrectos = false;
    }
    else if(bps.length==0){
            alert("Debe colocar algún dato en la casilla de los bps");
            variables.datosCorrectos = false;
    }else if(anchoBanda==0){
            alert("Debe colocar algún dato en la casilla del ancho de banda");
            variables.datosCorrectos = false;
    }
}
function calcularVariables(caracter) {
    // calclula las principales variables
    variables.periodo = 8 / variables.bps;
    variables.frecuencia = 1 / variables.periodo;
    variables.numArm = (variables.bw * 1000) / variables.frecuencia;

    
    variables.f = 1 / 8;
    variables.decimal = convertDec(caracter);
    variables.gt = convertBin(variables.decimal);
    variables.gt= "00"+variables.gt ;
    var j = 0;
    //alert(variables.gt.length);
    for (var i = 0; i <= variables.gt.length; i++) {
        if (variables.gt.charAt(i) == 1) {
            j++
        }
    }
    variables.dc = (j / 8) * 2;
    actualizarDatos(variables.periodo, variables.frecuencia, variables.numArm, variables.f, variables.decimal, variables.gt,variables.dc);
    //calcularFourier(variables.numArm,variables.binario,8,variables.f);

}
function actualizarDatos(periodo, frecuencia, numArmonicos, f, decimal, binario,dc) {
    // actualiza los datos en el html
    if (variables.datosCorrectos == true) {
        document.getElementById("periodo").value = periodo;
        document.getElementById("frecuencia").value = frecuencia;
        document.getElementById("numArmonicos").value = numArmonicos;
        document.getElementById("f").value = f;
        document.getElementById("dc").value = dc;
        document.getElementById("decimal").value = decimal;
        document.getElementById("binario").value = binario;
    }
    else {
        document.getElementById("periodo").value = "";
        document.getElementById("frecuencia").value = "";
        document.getElementById("numArmonicos").value = "";
        document.getElementById("f").value = "";
        document.getElementById("dc").value = "";
        document.getElementById("decimal").value = "";
        document.getElementById("binario").value = "";

    }


}
function convertDec(str) {
    // debe convertir el caracter que llega a decimal
    var bytes = [];
    for (var i = 0; i < str.length; ++i) {
        var charCode = str.charCodeAt(i);
        if (charCode > 0xFF)  // char > 1 byte since charCodeAt returns the UTF-16 value
        {
            throw new Error('Caracter ' + String.fromCharCode(charCode) + ' no puede ser representado como byte en US-ASCII.');
        }
        bytes.push(charCode);
    }
    return bytes;
}
function convertBin(dec) {
    // debe convertir el decimal que llega a código binario

    var binario = (dec >>> 0).toString(2);
    return binario ;
    
}
function graficarFourier(){
    if(variables.datosCorrectos==true){
        CalcularFourier(variables.bps,variables.bw,variables.periodo,variables.frecuencia,variables.numArm,variables.gt) ;
        
    }
    else{
        alert("No se tienen todos los datos necesarios, para hallarlos tiene que oprimir primero el botón Calcular armonicos");
    }
    
}
function limpiarGraficas(){
    //limpiar();
    location.reload(true);
}


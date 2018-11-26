/*
1.Fouerier recibe todos los parametros 
2. se hace unn for con un numero de iteraciones igual el de numArm
3. en cada iteracion se crea un objeto armonico  y despues se guarda en this.armonicos[]
4. al finalizar se llama a la funcion graficar() y se envia como parametro el arreglo de armonicos y f
*/ 

function Fourier(bps,bw,periodo,frecuencia,numArm,gt)
{
    /*atributo es igualado con su respectivo valor que llega como parametro en la clase fourier menos armonicos,f,dc */ 
    this.bps = bps;
    this.bw = bw;
    this.armonicos = [];
    this.gt = gt ;
    this.periodo = periodo;
    this.frecuencia = frecuencia;
    this.numArm = numArm;
    this.f = 1/8;
    this.dc = 3/8;
}

function CalcularFourier(bps,bw,periodo,frecuencia,numArm,gt)
{
    // Recibe los datos calculados por los Controles
    // Crea un objeto de la clase Fourier dando como 
    // parámetro los valores enviados por Controles
    var fourier = new Fourier(bps,bw,periodo,frecuencia,numArm,gt);
    for(var i=1; i<= numArm;i++)
    {
        var arm = new Armonico(i,gt);
        fourier.armonicos[i] = arm;
    }
    graficar(fourier.armonicos,fourier.f);
}
///JavaScript
function Armonico(num,binario){
	this.numero=num;
	this.gt = binario ;
	this.An = this.calcularAn(binario);
	this.Bn = this.calcularBn(binario);
	this.Cn = this.calcularCn( );
	this.Theta = this.calcularTheta();
}
Armonico.prototype.calcularAn=function(gt)
{
	
	var total=0;
	var aux=0;
	var z=4;
	//console.log("En funcion calcularAn, esto es gt "+gt+" "+gt.length);
	for(var i=0;i<gt.length;i++)
	   {
		if(gt.charAt(i) == 1)
		{
			//console.log("Armonico.numero "+ this.numero);
			//console.log((Math.cos((Math.PI*this.numero*(i+2))/z)));
		   aux=(Math.cos((Math.PI*this.numero*(i+2))/z))* -1 + Math.cos((Math.PI*this.numero*(i+1))/z);
		   total+=aux;
		   //console.log("Suma de an, imprimir aux "+total);
		}
	   }
	total *=1/(Math.PI*this.numero);
	console.log("Esto es total en an "+total);
	this.An=total;
	return total ;
}
Armonico.prototype.calcularBn=function(gt)
{
	
	var total=0;
	var aux=0;
	var z=4;
	for(var i=0;i<gt.length;i++)
	   {
		if(gt.charAt(i) == 1)
		{
		   aux=(Math.sin((Math.PI*this.numero*(i+2))/z))-Math.sin((Math.PI*this.numero*(i+1))/z);
		   total+=aux;

		}
	   }
	total *=1/(Math.PI*this.numero);
	//console.log("Esto es total en bn "+total);
	this.Bn=total;
	return total ;
}
Armonico.prototype.calcularCn=function()
{
	return this.Cn=Math.sqrt((this.An*this.An)+(this.Bn*this.Bn));
}
Armonico.prototype.calcularTheta=function()
{
	return this.Theta=Math.atan2(this.Bn,this.An);
	
}

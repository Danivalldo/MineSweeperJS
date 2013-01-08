/*
mineSweeperJS (another more :D)
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

A Javascript Library to create mineSweeper Games fully css customizable
http://www.dimo.cat
Dimo Visual Creatives S.C.P.
@DaniValldosera
*/

var mineSweeper=(
	function(settings){

		var gridMinasCerca=[{x:-1,y:0},
							{x:-1,y:-1},
							{x:0,y:-1},
							{x:1,y:-1},
							{x:1,y:0},
							{x:1,y:1},
							{x:0,y:1},
							{x:-1,y:1}];

		var mineSize=40+4; //change it in CSS too
		var idsSelected=new Array();
		var numMinas;
		var reaccion=new Array();
		var reacting=false;

		var campoMinas={
			dom:document.createElement("div"),
			grid:new Array()
		};

		var creaJuego=function(_elemToPut){

			if((_elemToPut==undefined)||(document.getElementById(_elemToPut)==null)){
				_elemToPut=document.getElementsByTagName("body");
				_elemToPut=_elemToPut[0];
			}else{
				_elemToPut=document.getElementById(_elemToPut);
			};

			settings.grid[0]=Math.floor(settings.grid[0]);
			settings.grid[1]=Math.floor(settings.grid[1]);
			settings.minas=Math.floor(settings.minas);

			numMinas=settings.grid[0]*settings.grid[1];

			if(settings.minas>numMinas){
				settings.minas=numMinas;
			}else if(settings.minas<=0){
				settings.minas=1;
			}

			campoMinas.dom.className="minefield";
			campoMinas.dom.style.width=(settings.grid[0]*mineSize)+"px";
			campoMinas.dom.style.height=(settings.grid[1]*mineSize)+"px";
			_elemToPut.appendChild(campoMinas.dom);

			assignaBombas();

			var n=0;

			for(var i=0; i<settings.grid[1]; i++){

				campoMinas.grid[i]=new Array();

				for(var j=0; j<settings.grid[0]; j++){
				n++;

				var _nMina = new mina();
				_nMina.posicion.x=j;
				_nMina.posicion.y=i;
				_nMina.id=n;
				_nMina.bomba=compruebaAssigna(_nMina.id);
				campoMinas.dom.appendChild(_nMina.dom);
				campoMinas.grid[i][j]=_nMina;

				};

			};//bucle crea minas;
			
			for(var d=0; d<campoMinas.grid.length; d++){

				for(var k=0; k<campoMinas.grid[d].length; k++){

					campoMinas.grid[d][k].bombasCerca=tocaBomba(campoMinas.grid[d][k]);

				};
			};

		};//End creaJuego

		var compruebaAssigna=function(_idBuscar){
			if(idsSelected.lastIndexOf(_idBuscar)!=-1){

				return true;

			}else{

				return false;

			}
		};

		var assignaBombas=function(){

			var idspossibles=new Array();

			for(var i=1; i<numMinas+1; i++){
				idspossibles.push(i);//Crea array de 0 con valor 1 a n con valor numMinas
			};

			for(var n=0; n<settings.minas; n++){

				var _randomPos=Math.floor(Math.random()*idspossibles.length);
				var _idSelected=idspossibles[_randomPos];

				idspossibles.splice(_randomPos,1);
				idsSelected.push(_idSelected);
			};
			
		};

		var tocaBomba = function(_mina){

			var _bombasCerca=0;
			var _limiteX=settings.grid[0]-1;
			var _limiteY=settings.grid[1]-1;
			
			for(var n=0; n<gridMinasCerca.length; n++){

				var _poscerca={_x:_mina.posicion.x+gridMinasCerca[n].x,
							_y:_mina.posicion.y+gridMinasCerca[n].y};

				if((_poscerca._x<0)||(_poscerca._x>_limiteX)||(_poscerca._y<0)||(_poscerca._y>_limiteY)){
					//Busca fuera de los limites

				}else{

					var _tMina=campoMinas.grid[_poscerca._y][_poscerca._x];

					if(_tMina.bomba){
										
						_bombasCerca++;

					};
				};
			};
			
			return _bombasCerca;
		};

		var reactCadena = function(_mina){

			var _limiteX=settings.grid[0]-1;
			var _limiteY=settings.grid[1]-1;
			
			for(var n=0; n<gridMinasCerca.length; n++){

				var _poscerca={_x:_mina.posicion.x+gridMinasCerca[n].x,
							_y:_mina.posicion.y+gridMinasCerca[n].y};

				if((_poscerca._x<0)||(_poscerca._x>_limiteX)||(_poscerca._y<0)||(_poscerca._y>_limiteY)){
					//Busca fuera de los limites

				}else{

					var _tMina=campoMinas.grid[_poscerca._y][_poscerca._x];

					if(_tMina.activa==false){
						if(_tMina.bombasCerca>0){
						_tMina.dom.innerHTML=_tMina.bombasCerca;
						_tMina.dom.className="mina activa tipo cmina"+_tMina.bombasCerca;
						}else{
						_tMina.dom.className="mina activa";
						};
						_tMina.activa=true;
						
						if((_tMina.bombasCerca==0)&&(reaccion.lastIndexOf(_tMina)==-1)){

							reaccion.push(_tMina);
						};
					};
				};

			};

			if(reaccion.length>0){
				var _nMina=reaccion[0];
				reaccion.splice(0,1);
				reactCadena(_nMina);
			}else{
				reacting=false;
			};
		};

		var mina=function(){

			this.id;
			this.bomba=false;
			this.posicion={x:0,y:0};
			this.dom;
			this.activa=false;
			this.bombasCerca=0;

			var u=this;

			this.dom=document.createElement("div");
			this.dom.className="mina";
			this.dom.addEventListener("click",function(){
				if((!reacting)&&(!u.activa)){
				reacting=true;
				if(!u.bomba){
					if(u.bombasCerca>0){
					u.dom.innerHTML=u.bombasCerca;
					u.dom.className="mina activa tipo cmina"+u.bombasCerca;
					}else{
					u.dom.className="mina activa";
					};
					u.activa=true;
					if(u.bombasCerca==0){
						reactCadena(u);
					}else{
					reacting=false;
					}

				}else{
					alert("HAS TOCADO UNA BOMBA PERDISTE!");
					//u.dom.style.backgroundColor="#F00";
					u.dom.className="explota mina";
					reacting=false;
				};

				};
			},false);

		};// Classe Mina
	
	return{
		creaJuego:creaJuego
	};
	
	}//constructor
);
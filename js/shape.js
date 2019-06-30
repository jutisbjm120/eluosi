//定义cell类型描述每个格子的数据结构：
//三个属性：r c src
function cell(r,c,src){
	this.r=r;
	this.c=c;
	this.src=src;	
}
//继承的父类型对象
function shape(cells,src,states,orgi){
	this.cells=cells;
	for (var i=0;i<this.cells.length;i++) {
		this.cells[i].src=src;
	}
	this.orgcell=this.cells[orgi];
	this.states=states;
	this.statei=0;	//保存每个图形的所处的旋转状态
}
shape.prototype={
	moveleft:function(){
		for (var i=0;i<this.cells.length;i++) {
			this.cells[i].c--;
		}
	},
	moveright:function(){
		for (var i=0;i<this.cells.length;i++) {
			this.cells[i].c++;
		}
	},
	movedown:function(){
		for (var i=0;i<this.cells.length;i++) {
			this.cells[i].r++;
		}
	},
	rotateR:function(){//顺时针旋转
		this.statei++;
		this.statei==this.states.length
					          &&(this.statei=0);
		this.rotate();
	
	},
	rotate:function(){//负责旋转
		var state=this.states[this.statei];
		for (var i=0;i<this.cells.length;i++) {
			this.cells[i].r=this.orgcell.r+state["r"+i];
			this.cells[i].c=this.orgcell.c+state["c"+i];
		}
	},
	rotateL:function(){//逆时针旋转
		this.statei--;
		this.statei==-1&&(this.statei=this.states.length-1);
		this.rotate();

	},
	IMGS:{
    T:"img/T.png",O:"img/O.png",I:"img/I.png",S:"img/S.png",Z:"img/Z.png",L:"img/L.png"
    ,J:"img/J.png"
  },
}
function state(){
	for (var i=0;i<4;i++) {
		this["r"+i]=arguments[2*i];
		this["c"+i]=arguments[2*i+1];
	}
	
}
function T(){
	shape.call(this,
		[new cell(0,3),new cell(0,4),
		new cell(0,5),new cell(1,4),],
		this.IMGS.T,
		[	//states r0 c0  r1c1 r2 c2 r3 c3
			new state(0,-1, 0,0, 0,+1, +1,0),
			new state(-1,0, 0,0, +1,0, 0,-1),
			new state(0,+1, 0,0, 0,-1, -1,0),
			new state(+1,0, 0,0, -1,0, 0,+1)
		],1
	);
}
function O(){
	shape.call(this,
		[new cell(0,4),new cell(0,5),
		new cell(1,4),new cell(1,5),],
	this.IMGS.O	,
		[new state(0,-1,0,0,+1,-1,+1,0)],1
	);
}
function I(){
	shape.call(this,
		[new cell(0,3),new cell(0,4),
		new cell(0,5),new cell(0,6),],
		this.IMGS.I,[
		new state(0,-1,0,0,0,+1,0,+2),
		new state(-1,0,0,0,+1,0,+2,0)
		],1
	);
}
function S(){
	shape.call(this,
		[new cell(0,4),new cell(0,5),
		new cell(1,3),new cell(1,4),],
		this.IMGS.S,[
		new state(-1,0,-1,+1,0,-1,0,0),
		new state(0,+1,+1,+1,-1,0,0,0)
		],3
	);
}
function Z(){
	shape.call(this,
		[new cell(0,3),new cell(0,4),
		new cell(1,4),new cell(1,5),],
		this.IMGS.Z,[
		new state(-1,-1,-1,0,0,0,0,+1),
		new state(-1,+1,0,+1,0,0,+1,0)
		],2
	);
}
function L(){
	shape.call(this,
		[new cell(0,3),new cell(0,4),
		new cell(0,5),new cell(1,3),],
		this.IMGS.L,
		[	//states r0 c0  r1c1 r2 c2 r3 c3
			new state(0,-1, 0,0, 0,+1, +1,-1),
			new state(-1,0, 0,0, +1,0, -1,-1),
			new state(0,+1, 0,0, 0,-1, -1,+1),
			new state(+1,0, 0,0, -1,0, +1,+1)
		],1
	);
}
function J(){
	shape.call(this,
		[new cell(0,3),new cell(0,4),
		new cell(0,5),new cell(1,5),],
		this.IMGS.T,
		[	//states r0 c0  r1c1 r2 c2 r3 c3
			new state(0,-1, 0,0, 0,+1, +1,+1),
			new state(-1,0, 0,0, +1,0, +1,-1),
			new state(0,+1, 0,0, 0,-1, -1,-1),
			new state(+1,0, 0,0, -1,0, -1,+1)
		],1
	);
}
Object.setPrototypeOf(
	T.prototype,shape.prototype
);
Object.setPrototypeOf(
		O.prototype,shape.prototype
);
Object.setPrototypeOf(
	I.prototype,shape.prototype
);
Object.setPrototypeOf(
	S.prototype,shape.prototype
);
Object.setPrototypeOf(
	Z.prototype,shape.prototype
);
Object.setPrototypeOf(
	L.prototype,shape.prototype
);
Object.setPrototypeOf(
	J.prototype,shape.prototype
);
//var t=new T();
//var o=new O();
//var i=new I();


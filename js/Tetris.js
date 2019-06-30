var tetris={
	RN:20,CN:10,//总行数 总列数
	CSIZE:26,//每个格子的大小
	OFFSET:15,//上边和坐标修正的边距
	pg:null,//保存游戏容器div
	shape:null,//保存正在下落的主角图形
	nextshape:null,//保存下一个备胎图形
	timer:null,//保存定时器
	wall:null,//保存墙
	lines:0,//保存删除的的行数
	score:0,//保存游戏得分
	SCORES:[0,10,30,60,100],//保存删除行数对应的得分
	state:1,//保存游戏状态
	RUNNING:1,//运行状态
	GAMEOVER:0,//游戏结束
	PAUSE:2,//暂停状态
	interval:500,//保存下落的时间间隔即快慢
	start:function(){//启动游戏
		this.state=this.RUNNING;
		this.wall=[];
		this.lines=this.score=0;//重置游戏分数和行数
		for (var i=0;i<this.RN;i++) {
			this.wall.push(new Array(this.CN));
		}
		this.pg=document.querySelector(".playground");
		//生成主角和备胎图形
		this.shape=this.randomShape();
		this.nextshape=this.randomShape();
		this.paint();//重绘一切
		this.timer=setInterval(
			this.moveDown.bind(this),this.interval);
		document.onkeydown=function(e){
			switch (e.keyCode){
				case 37://是37调左移方法
				this.state==this.RUNNING&&
					this.moveLeft();
					break;
				case 39://是39调右移方法
				this.state==this.RUNNING&&
					this.moveRight();
					break;
				case 40://是40调下移方法
				this.state==this.RUNNING&&
					this.moveDown();
					break;
				case 32://是32一落到底
				this.state==this.RUNNING&&
					this.hardDrop();
					break;
				case 38://是38正向旋转
				this.state==this.RUNNING&&
					this.rotateR();
					break;
				case 90://是90你向旋转
				this.state==this.RUNNING&&
					this.rotateL();
					break;
				case 80://是80暂停
				this.state==this.RUNNING&&
					this.pause();
					break;
				case 67://是67调用继续方法
				this.state==this.PAUSE&&
					this.myContinue();
					break;
				case 81://是81调用结束方法
				//this.state==this.RUNNING&&
					this.gameOver();
					break;
				case 83://是83调用start发发
				this.state==this.GAMEOVER&&
					this.start();
				    break;
			}
		}.bind(this);
	},
	gameOver:function(){//结束方法
		this.state=this.GAMEOVER;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	pause:function(){//暂停方法
		this.state=this.PAUSE;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	myContinue:function(){//继续方法
		this.state=this.RUNNING;
		this.timer=setInterval(
			this.moveDown.bind(this),this.interval
		);
	},
	canrotate:function(){//判断能否旋转
		for (var i=0;i<this.shape.cells.length;i++) {
			var cell=this.shape.cells[i];
			if(cell.r<0||cell.r>=this.RN||cell.c<0||cell.c>=this.CN||
			this.wall[cell.r][cell.c]!==undefined){
				return false;
			}
		}
		return true;
	},
	rotateR:function(){//向右旋转
		this.shape.rotateR();
		if(!this.canrotate()){
			this.shape.rotateL();
		}else{
			this.paint();
		}
	},
	rotateL:function(){//向左旋转
		this.shape.rotateL();
		if(!this.canrotate()){
			this.shape.rotateR();
		}else{
			this.paint();
		}
	},
	hardDrop:function(){//一落到底
		while(this.canDown()){
			this.moveDown();
		}
	},
	canLeft:function(){//判断能否左移
		for (var i=0;i<this.shape.cells.length;i++) {
			var cell=this.shape.cells[i];
			if(cell.c==0||this.wall[cell.r][cell.c-1]){
				return false;
			}
		}
		return true;
	},
	moveLeft:function(){//左移
		if(this.canLeft()){
			this.shape.moveleft();
			this.paint();
		}
	},
	canRight:function(){//判断能否右移
		for (var i=0;i<this.shape.cells.length;i++) {
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]){
				return false;
			}
		}
		return true;
	},
	moveRight:function(){//左移
		if(this.canRight()){
			this.shape.moveright();
			this.paint();
		}
	},
	canDown:function(){//是否可以下落
		for (var i=0;i<this.shape.cells.length;i++) {
			var cell=this.shape.cells[i];
			if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]!==undefined){
				return false;
			}
		}
		return true;
	},
	landIntowall:function(){//落到墙里
		for (var i=0;i<this.shape.cells.length;i++) {
			var cell=this.shape.cells[i];
			this.wall[cell.r][cell.c]=cell;
		}
	},
	moveDown:function(){//让主角图形下落
		if(this.canDown()){
			this.shape.movedown();
		}else{
		this.landIntowall();
		var ln=this.deleteRows();
		this.score+=this.SCORES[ln];
		this.lines+=ln;
		if(!this.isGameOver()){
			this.shape=this.nextshape;
			//新建备胎图形
			this.nextshape=this.randomShape();
			}else{
				this.state=this.GAMEOVER;
				clearInterval(this.timer);
				this.timer=null;
			}
		}
		this.paint();//重绘一切
	},
	isGameOver:function(){//判断是否结束游戏
		for(var i=0;i<this.nextshape.cells.length;i++){
			var cell=this.nextshape.cells[i];
			if(this.wall[cell.r][cell.c]!==undefined){
				return true;
			}
		}
		return false;
	},
	painstate:function(){//重绘图片
		if(this.state==this.GAMEOVER){
			var img=new Image();
			img.src="img/game-over.png";
			this.pg.appendChild(img);
		}else if(this.state==this.PAUSE){
			var img=new Image();
			img.src="img/pause.png";
			this.pg.appendChild(img);
		}
	},
	deleteRows:function(){//检查并删除所有满格行
		for (var i=this.RN-1,ln=0;i>=0;i--) {
			if(this.wall[i].join("")==""||ln==4){
					break;
				}
			if(this.isFullRow(i)){
				this.deleteRow(i);
				i++;
				ln++;
			}
		}
		return ln;
	},
	isFullRow:function(r){//判断是否为满格行
		return String(this.wall[r]).search(/^,|,,|,$/)==-1;
		
	},
	deleteRow:function(r){//删除行
		for (var r=this.RN-1;r>=0;r--) {
			this.wall[r]=this.wall[r-1];
			this.wall[r-1]=new Array(this.CN);
			for (var c=0;c<this.CN;c++) {
				if(this.wall[r][c]!==undefined){
					this.wall[r][c].r++;
				}
			}
			if(this.wall[r-2].join("")==""){break;}
		}
	},
	randomShape:function(){//随机生成一个图形
		switch (Math.floor(Math.random()*7)){
			case 0:return new O();
				break;
			case 1:return new T();
				break;
			case 2:return new I();
				break;
			case 3:return new S();
				break;
			case 4:return new Z();
				break;
			case 5:return new L();
				break;
			case 6:return new J();
				break;
		}
	},
	paint:function(){//重绘一切函数的构造
		this.pg.innerHTML=
		this.pg.innerHTML.replace(
			/<img\s[^>]+>/g,""
		);
		this.paintstart();//重绘主角图形
		this.paintwall();//重绘墙中的格
		this.paintNext();//重绘备胎
		this.paintScore();//重绘成绩
		this.painstate();//重绘状态
	},
	paintScore:function(){//重绘分数和行数
		document.getElementById("score")
				.innerHTML=this.score;
		document.getElementById("lines")
		        .innerHTML=this.lines;
	},
	paintNext:function(){//绘制备胎图形
			var frag=document.createDocumentFragment();
			for (var i=0;i<this.nextshape.cells.length;i++) {
			var img=this.paintCell(this.nextshape.cells[i],frag);
			img.style.top=parseFloat(img.style.top)+this.CSIZE+"px";
			img.style.left=parseFloat(img.style.left)+this.CSIZE*10+"px";
		
		}
		this.pg.appendChild(frag);
	},
	paintwall:function(){//重绘墙
		var frag=document.createDocumentFragment();
		for (var r=this.wall.length-1;r>=0;r--) {
			if(this.wall[r].join("")!=""){
				for (var c=0;c<this.CN;c++) {
					if(this.wall[r][c]){
					this.paintCell(this.wall[r][c],frag);
					}
				}
			}else{break;}
		}
		this.pg.appendChild(frag);
	},
	paintCell:function(cell,frag){//单绘一个格
		var img=new Image();
			img.src=cell.src;
			img.style.width=this.CSIZE+"px";
			img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
			img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
			frag.appendChild(img);
			return img; 
	},
	paintstart:function(){//专门绘制主角图形
		var frag=document.createDocumentFragment();
		for (var i=0;i<this.shape.cells.length;i++) {
			this.paintCell(this.shape.cells[i],frag);
		}
		this.pg.appendChild(frag);
	},	
}
tetris.start();
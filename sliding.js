var context=document.getElementById("puzzle").getContext('2d');
var img=new Image();
img.src='defa.jpg';
img.addEventListener('load',drawTiles,false);
var boardSize=document.getElementById('puzzle').width;              //获得画布的宽度
var tileCount=document.getElementById('scale').value;               //获得难度
var tileSize=boardSize/tileCount;                                   //计算出每个方块的宽度
var clickLoc=new Object();                                          //记录被单击的拼块的位置
clickLoc.x=0;                                                       //行号
clickLoc.y=0;                                                       //列号
var emptyLoc=new Object();                                          //记录空白拼块的位置
emptyLoc.x=0;                                                       //行号
emptyLoc.y=0;                                                       //列号
var solved=false;                                                   //拼图是否完成，false为未完成

//拼块的随机排列
var boardParts=new Object();
initBoard();                                                        //初始化拼块，并随机排列
function initBoard(){
    boardParts=new Array(tileCount*tileCount);
    for(var i=0;i<tileCount*tileCount;i++){
        boardParts[i]=i;
    }
    shift();                                                        //拼块的随机排列
}
function sortNumber(a,b){                                           //随机排列函数
        return Math.random()>0.5?-1:1;
}
function shift(){                                                   //拼块的随机排列
    boardParts.sort(sortNumber);
    emptyLoc.x=0;
    emptyLoc.y=0;
    solved=false;
}

//绘制所有拼块
function drawTiles(){
    context.clearRect(0,0,boardSize,boardSize);                     
    for(var i=0;i<tileCount;i++){                                   //行号
        for(var j=0;j<tileCount;j++){                               //列号
            var n=boardParts[i*tileCount+j];                        //计算出编号为n的拼块在原图的行号
            var x=parseInt(n/tileCount);                            //丢弃小数部分，保留整数部分
            var y=n%tileCount;
            console.log(x+":"+Math.floor(n/tileCount)+":"+y);
            if(i!=emptyLoc.x||j!=emptyLoc.y||solved==true){         //将编号为n的拼块显示在(i*tileSize,j*tileSize)处
                context.drawImage(img,x*tileSize,y*tileSize,tileSize,tileSize,i*tileSize,j*tileSize,tileSize,tileSize);
            }
        }
    }
}
document.getElementById('scale').onchange=function(){
    tileCount=this.value;                                           
    tileSize=boardSize/tileCount;                                   //计算拼块宽度大小
    initBoard();                                                    //重新初始化拼块，并随机排列
    drawTiles();                                                    //显示各个拼块
};
document.getElementById('puzzle').onmousemove=function(e){
    clickLoc.x=Math.floor((e.pageX-this.offsetLeft)/tileSize);
    clickLoc.y=Math.floor((e.pageY-this.offsetTop)/tileSize);
};
document.getElementById('puzzle').onclick=function(){
    if(distance(clickLoc.x,clickLoc.y,emptyLoc.x,emptyLoc.y)==1){   //计算鼠标所在网格坐标与空格位置间隔，如果间距为1则移动被单击的拼块
        slideTile(emptyLoc,clickLoc);                               //交换被单击和空块
        drawTiles();                                                //显示各个拼块
    }
    if(solved){
        setTimeout(function(){alert("蒸蚌！")},500);
    }
};
function distance(x1,y1,x2,y2){
    return Math.abs(x1-x2)+Math.abs(y1-y2);
}


//交换被单击的拼块和空块
function slideTile(emptyLoc,clickLoc){
    if(!solved){
        var t;
        t=boardParts[emptyLoc.x*tileCount+emptyLoc.y];
        boardParts[emptyLoc.x*tileCount+emptyLoc.y]=boardParts[clickLoc.x*tileCount+clickLoc.y];
        boardParts[clickLoc.x*tileCount+clickLoc.y]=t;
        emptyLoc.x=clickLoc.x;
        emptyLoc.y=clickLoc.y;
        checkSolved();
    }
}
function checkSolved(){
    var flag=true;
    for(var i=0;i<tileCount*tileCount;i++){
        if(boardParts[i]!=i)flag=false;
    }
    solved=flag;
}
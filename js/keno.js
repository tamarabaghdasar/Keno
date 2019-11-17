var curentRoundData={};
var curBalls;

function getChips(){
    var chipClSel=$('.chip');
    var chipWidth=chipClSel.width();
    var chipHeight=chipClSel.height();
    $.ajax({ url:'http://test_keno.beticus.com/kenodata/stakes.json',  timeout:1000, dataType: "json",
    // $.ajax({ url:'http://jsonp.inbet.cc/kenodata/stakes.json',  timeout:1000, dataType: "jsonp",
        success: function(data) {

            if (data!=null) {
                for(chips in data){
                    var chipSel=$('#chip'+chips);
                    var oldData=chipSel.children('span').html();
                    var newData=data[chips];
                    if(oldData!=newData){
                        var randColor=Math.ceil(Math.random()*4)-1;
                    }
                    var numId=chipSel.attr('numId');
                    var numSel=$("#num"+numId);
                    var left=numSel.offset().left;
                    var top=numSel.offset().top;
                    var width=numSel.width();
                    var height=numSel.height();
                    chipSel.css('left',left+width-chipWidth);
                    chipSel.css('top',top+height-2*chipHeight/3);
                    chipSel.html(data[chips]);
                    chipSel.fadeIn(1000);
                }
            } else {

            }
        },
        error: function() {

        }
    });
}
function sortNumber(a,b)
{
    return a - b;
}
function getHistory(){

        $.ajax({ url:'http://test_keno.beticus.com/newkeno/data.json',  timeout:10000, dataType: "json",
    // $.ajax({ url:'/newKeno/data.json',  timeout:10000, dataType: "json",
        success: function(data) {
            if (data!=null) {
                $('#historyTable > tbody >tr').each(function() {
                    var row=data.pop();
                    $(this).children('td:first').html('<div style="text-align:center;">'+row['id']+'</div>');
                    var balls=eval('['+row['ball']+']');
                    balls.sort(sortNumber);
                    for(var ball in balls){
                        if(balls[ball]<10) balls[ball]='&nbsp;'+balls[ball]+'&nbsp;';
                    }
                    var str=balls.join(' ');
                    $(this).children('td:last').html('<div>'+str+'</div>');
                    //$(this).children('td:last').html('<div style="text-align:right;">'+str+'</div>');

                });
                //resize();

            } else {

            }
        },
        error: function() {
            getHistory();
        }
    });

}
var getStatusRunning = false;
function getStatus(){
    var status;

    if (!getStatusRunning) {
        getStatusRunning = true;
        $.ajax({ url:'http://test_keno.beticus.com/kenodata/keno.json',  timeout:10000, dataType: "json",
        // $.ajax({ url:'http://jsonp.inbet.cc/kenodata/keno.json',  timeout:10000, dataType: "jsonp",
            success: function(data) {

                if (data!=null) {
                    var prevRound = curentRoundData['round'];
                    curentRoundData['round']=data.tiraj;
                    curentRoundData['jek_pot']=data.jek_pot;
                    //console.log("Current timer: " + curentRoundData['timeleft']);
                    if (data.shar == "" && data.timeleft > curentRoundData['timeleft'] && prevRound == data.tiraj) {
                    } else {
                        curentRoundData['timeleft']=data.timeleft;
                    }
                    //console.log("Current timer: " + curentRoundData['timeleft']);


                    var str=data.shar;
                    var arr=str.split(',',20);
                    curentRoundData['balls']=arr;
                    curentRoundData['str']=data.shar;
                    if(data.shar!="") curentRoundData['state']='game';
                    else curentRoundData['state']='bet';

                } else {

                }
                if(first){
                    resize();
                    first=0;
                    $('#round').html(curentRoundData['round']);
                    $('#state').html(curentRoundData['state']);
                    if(curentRoundData['jek_pot']!=''){
                        $('#jek_pot').html(curentRoundData['jek_pot']);
                        $('#jek_pot_holder').show();
                    }else{
                        $('#jek_pot_holder').hide();
                    }
                }

                if (isNewLoad && curentRoundData['state'] == 'game') {
                    $('#info-message').show();
                }
                else {
                    isNewLoad = false;
                    $('#info-message').hide();
                }

                getStatusRunning = false;
            },
            error: function() {
                getStatusRunning = false;
            }
        });
    }

}
function start(id,count,num) {
    curNum=num;
    var wP=$('#pipe').width();
    var wB=$('.ball').width();
    x=wP-count*wB+10;
    angle=360*(21-count);
    $(id).html(num);
    $(id).animate({
        left: x,
        rotate: angle+"deg"
    }, 4000-count*20,'swing');


}
function check(id) {
    $('#num'+id).removeClass('base').addClass('selected');



}
function finish(id,count,num) {

    var wP=$('#pipe').width();
    var wB=$('.ball').width();
    angle=0;
    $(id).animate({
        left: "8px",
        rotate: angle+"deg"
    }, 4000-count*20,'swing' );


}
function showBalls(){
    var i=1;
    var iID1=setInterval(function() {
        check(curentRoundData['balls'][(i-1)]);
        start('#ball'+i,i,curentRoundData['balls'][(i-1)]);
        i++;
        if(i>20){
            getHistory();
            clearInterval(iID1);
        }
    }, 1000);

}
function hideBalls(){
    var i=1;
    $('.num').removeClass('selected').addClass('base');
    var iID2=setInterval(function() {
        finish('#ball'+i,i,curentRoundData['balls'][(i-1)]);
        i++;
        if(i>20){
            getHistory();
            clearInterval(iID2);
        }
    }, 500);

}
$('.chip').live('click',function(){
    var num=$(this).attr('numId');
    var divHeight=$('.num').height();
    var divWidth=$('.num').width();
    chipSize=Math.min(divHeight,divWidth)/1.5;
    $(this).css('left',(1+(num-1)%10)*(divWidth+4)-chipSize+chipSize/4);
    $(this).css('top',((num-(num-1)%10)/10+1)*(divHeight+4)-chipSize);
    //alert(num);
});

function resize(){

    var w=$('#pipe').width()/21.5;
    //$('body')width($(window).width());
    //$('body')height($(window).height());
    $('.ball').width(w);
    $('.ball').height(w);
    $('#pipe').height(w);
    $('#closer').height(w);
    $('#closer').width(w);

    $('#pipe').css('-webkit-border-radius',w/2);
    $('#pipe').css('-moz-border-radius',w/2);
    $('#pipe').css('border-radius',w/2);
    $('#info').css('margin-top',1.5*w);
    $('#numbers').css('margin-top',1.5*w);


    var divHeight=$('.num').height();
    var divWidth=$('.num').width();
    $('.num').css('font-size',0.8*Math.min(divHeight,divWidth));

    var chipSize=Math.min(divHeight,divWidth)/1.5;
    $('.chip').css('background-size',chipSize);
    $('.chip').css('width',chipSize);
    $('.chip').css('height',chipSize);
    //$('.chip').css('top',divHeight-chipSize+chipSize/4);
    //$('.chip').css('left',divWidth-chipSize+chipSize/4);
    $('.chip').css('padding-top',chipSize/3);
    var divWidth=$('.chip').width();
    $('.chip').css('font-size',0.35*Math.min(divHeight,divWidth));



    $('.ball').css('-webkit-border-radius',w/2);
    $('.ball').css('-moz-border-radius',w/2);
    $('.ball').css('border-radius',w/2);
    var divHeight=$('.ball').height();
    var divWidth=$('.ball').width();
    $('.ball').css('font-size',0.72*Math.min(divHeight,divWidth));

    $('.small').css('font-size',0.4*Math.min(divHeight,divWidth));

    var wDiv=$('#round').width();
    var wAll=$('#infoData').width();
    $('#history').width(wAll-wDiv-30);

    var topT=$("#rezTable").offset().top;
    var topN=$("#numbers").offset().top;
    var heightN=$("#numbers").height();
    $("#rezTable").height(topN+heightN-topT);
    var divHeight=$('td:.rezult').height();
    var divWidth=$('td:.rezult').width();
    $('th').width(divHeight);
    $('td:.rezult').css('font-size',0.75*Math.min(divHeight,divWidth));
    $('th').css('font-size',0.75*Math.min(divHeight,divWidth));


    var left=$("#rezults").offset().left;
    var top=$("#rezults").offset().top;
    var scoreNameSize=left-$("#num60").offset().left-$("#num60").width();
    $('.scoreName').height(scoreNameSize/2);
    $('#scoreH').css('left',left);
    $('#scoreH').css('top',top-$('#scoreH').height());
    $('#scoreH').css('width',$("#rezults").width());
    $('#scoreV').css('width',$("#rezults").height());
    $('#scoreV').css('left',left- $("#rezults").height()/2-$("#scoreV").height()/2-2);
    $('#scoreV').css('top',top+$("#rezults").height()/2-$('#scoreV').height()/2+1);
    $('#scoreV').rotate(-90);

    var divHeight=$('.scoreName').height();
    $('.scoreName').css('font-size',0.8*divHeight);







}

var begin=0;
var end=0;
var first=1;
var isNewLoad = true;
function main(){
    var today = new Date();
    var time_start=today.getTime();

    try{
        if(first) getStatus();
        if((begin==0)&&(end==0)){
            getStatus();
        }

        var timeleft=curentRoundData['timeleft'];

        if((timeleft%5)!=0){
            curentRoundData['timeleft']--;

        }else{
            getStatus();
        }
        $("#progressbar").progressbar({
            value: (1-timeleft/120)*100
        });
        var sec= timeleft%60;
        if(sec<10) sec='0'+sec;
        var minuts=(timeleft-sec)/60
        $('#timeleft').html(minuts+':'+sec);

        if((begin==0)&&(end==0)){
            $('#round').html(curentRoundData['round']);
            if(curentRoundData['jek_pot']!=''){
                $('#jek_pot').html(curentRoundData['jek_pot']);
                $('#jek_pot_holder').show();
            }else{
                $('#jek_pot_holder').hide();
            }
            end=1;
        }
        if((curentRoundData['state']=='bet')&&(begin==1)){
            $('.chip').hide();
            $('#round').html(curentRoundData['round']);
            $('#state').html(curentRoundData['state']);
            if(curentRoundData['jek_pot']!=''){
                $('#jek_pot').html(curentRoundData['jek_pot']);
                $('#jek_pot_holder').show();
            }else{
                $('#jek_pot_holder').hide();
            }
            hideBalls();
            begin=0;
            end=1;

        }
        if((curentRoundData['state']=='game')&&end==1){
            $('#round').html(curentRoundData['round']);
            $('#state').html(curentRoundData['state']);
            if(curentRoundData['jek_pot']!=''){
                $('#jek_pot').html(curentRoundData['jek_pot']);
                $('#jek_pot_holder').show();
            }else{
                $('#jek_pot_holder').hide();
            }

            showBalls();
            begin=1;
            end=0;
            historyFirst=1;
        }
        if((curentRoundData['state']=='bet')){
            getChips();
        }

    }catch(e){

    }finally{
        var today = new Date();
        var time_finish=today.getTime();
        var delta=time_finish-time_start;
        //$('#log').html(delta);
        if(delta>1000)
            setTimeout(main, 1);
        else
            setTimeout(main, 1000-delta);
    }

}
$(document).ready(function(){
    /*if(  navigator.userAgent.indexOf('Firefox/4.0') != -1 ) {
     alert(401);
     } */
    $("#progressbar").progressbar({
        value: 20
    });
    getHistory();
    resize();
    $(window).resize(function(){
        resize();
    });
    main();

    setTimeout(function(){
        $(window).resize();
        $('#scoreV').rotate(-90);
    }, 1000);


});
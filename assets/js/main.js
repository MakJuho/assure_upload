var audioContext = null;
var meter = null;

window.onload = function() {
    try{
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
	    audioContext = new AudioContext();
    }catch(e){
        this.alert('이 브라우저에서는 Web Audio API가 지원되지 않습니다. 크롬이나 사파리를 이용해 주세요.');
    }

    try {
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
    document.getElementById("set").innerHTML = setVal;
}

function didntGetStream() {
    alert('이 기능은 마이크를 사용합니다. 다른 앱에서 마이크를 사용하고 있다면 종료하여 주세요.');
}

var mediaStreamSource = null;
var data=40;
var cnt = 0;
var time=0;
var desc=null;
var ref=70;
var setVal=0;
var list = new Array();
var tmp=0;
var lists=null;
var count=0;
var ref_1;
var ref_2;
var ref_3;
var ref_4;
var ref_5;

//gauge
var target;
var gauge;

// 기준선 정보
var add_val1 = document.getElementById("add1");
var add_val2 = document.getElementById("add2");
var add_val3 = document.getElementById("add3");
var add_val4 = document.getElementById("add4");
var add_val5 = document.getElementById("add5");

function gotStream(stream) {
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    data=setVal+meter.volume;
    data=data.toFixed(1);

    var trace1 = {
        x:[time],
        y:[data],
        type: 'line',
        showlegend: false,
        line:{
            color:'red',
            width: 4,
        }
    };
    var trace2 = {
        x:[time],
        y:[ref_1],
        type:'line',
        mode:'lines',
        name: '기준선1',
        showlegend: false,
    };
    var trace3 = {
        x:[time],
        y: [ref_2],
        type: 'line',
        mode:'lines',
        name: '기준선2',
        showlegend: false
    }
    var trace4 = {
        x:[time],
        y: [ref_3],
        type: 'line',
        mode:'lines',
        name: '기준선3',
        showlegend: false
    }
    var trace5 = {
        x:[time],
        y:[ref_4],
        type:'line',
        mode:'lines',
        name: '기준선4',
        showlegend: false
    };
    var trace6 = {
        x:[time],
        y:[ref_5],
        type:'line',
        mode:'lines',
        name: '기준선5',
        showlegend: false
    };
    var chartData = [trace1, trace2, trace3, trace4, trace5, trace6];
    var layout={
        title: '실시간 그래프',
        showlegend: true,
        "titlefont": {
            "size": 36,
            "color":'white'
        },
        legend:{
            font:{
                size:20,
                color:"white",
            }
        },
        xaxis:{
            range:[0,30],
            color:"white",
            showgrid: true,
            gridcolor: "grey",
            gridwidth:0.1,
            zeroilne:true,
            zerolinecolor: "white",
            zerolinewidth:3,
            showticklabels: true,
            tickfont: {
                size: 23,
                color: 'white'
            },
        },
        yaxis:{
            range:[0,120],
            color:"white",
            showgrid: true,
            zeroilne:true,
            gridcolor: "white",
            gridwidth:1,
            zerolinecolor: "white",
            zerolinewidth:3,
            showticklabels: true,
            tickfont: {
                size: 23,
                color: 'white'
            },
        },
        autosize: true,
        height: 750,
        margin: {
            l: 50,
            r: 50,
            b: 120,
            t: 100,
            pad: 4
        },
    };
    // gauge
    var opts = {
        angle: 0,
        lineWidth: 0.2,
        radiusScale: 0.71,
        pointer: {
            length: 0.50,
            strokeWidth: 0.04,
            color: '#ff0000'
        },
        limitMax: false,
        limitMin: false,
        percentColors: [[0.0, "#008000"],[0.5, "#ffff00"], [0.8, "#ff0000"]],
        strokeColor: '#E0E0E0',
        generateGradient: true,
        highDpiSupport: true,
        renderTicks: {
            divisions: 4,
            divWidth: 1.3,
            divLength: 0.8,
            divColor: '#ffffff',
            subDivisions: 3,
            subLength: 0.6,
            subWidth: 0.2,
            subColor: '#000000'
        },
        staticLabels: {
            font: "30px sans-serif",
            labels: [0, 30, 60, 90, 120],
            color: "#ffffff",
            fractionDigits: 0
        }
    };
    target = document.getElementById('gauge');
    gauge = new Gauge(target).setOptions(opts);
    gauge.maxValue = 120;
    gauge.setMinValue(0);
    gauge.animationSpeed = 0.9;
    gauge.set(data);

    Plotly.newPlot('chart', chartData, layout, {scrollZoom:false, displaylogo: false, modeBarButtonsToRemove: ['select2d', 'lasso2d', 'pan2d', 'toImage', 'sendDataToCloud', 'resetScale2d', 'hoverClosestCartesian', 'toggleSpikelines', 'hoverCompareCartesian', 'zoom2d']});

    setInterval(function(){
        data=setVal+meter.volume;
        data=data.toFixed(1);
        time+=0.1;

        ref_1 = add_val1.value;
        ref_2 = add_val2.value;
        ref_3 = add_val3.value;
        ref_4 = add_val4.value;
        ref_5 = add_val5.value;

        if(data<10){
            desc="숨쉬는 소리";
        }
        else if(data<20){
            desc="나뭇잎 스치는 소리";
        }
        else if(data<30){
            desc="속삭이는 소리";
        }
        else if(data<40){
            desc="조용한 도서관";
        }
        else if(data<50){
            desc="조용한 사무실";
        }
        else if(data<60){
            desc="보통 대화소리";
        }
        else if(data<70){
            desc="진공청소기 소리";
        }
        else if(data<80){
            desc="시끄러운 음악";
        }
        else if(data<90){
            desc="잔디깎기 소리";
        }
        else if(data<100){
            desc="모터사이크 소리";
        }
        else if(data<110){
            desc="콘서트";
        }
        else{
            desc="고통을 주는 소음, 천둥";
        }
        document.getElementById("desc").innerHTML = desc;
        document.getElementById("show").innerHTML = data+"dB";
        gauge.set(data);

        var update = {
            x:  [[time],[time],[time],[time],[time],[time]],
            y: [[data],[ref_1],[ref_2],[ref_3],[ref_4],[ref_5]]
        }

        Plotly.extendTraces('chart',update, [0,1,2,3,4,5]);
        cnt=cnt+1;
        if(cnt>300){
            // time=30;
            Plotly.relayout('chart',{
                xaxis:{
                    range: [time-30,time],
                    color:"white",
                    showgrid: true,
                    gridcolor: "grey",
                    gridwidth:0.1,
                    zeroilne:true,
                    zerolinecolor: "white",
                    zerolinewidth:3,
                    showticklabels: true,
                    tickfont: {
                        size: 23,
                        color: 'white'
                    },
                },
            })
        }
    },100);

    var int_box = Array.apply(null, new Array(5)).map(Number.prototype.valueOf, 0);
    var check = 0;
    $(document).ready(function () {
        count = 0;
        // 기준선 추가
        $("#add_btn").click(function () {
            for (var i = 0; i < int_box.length; i++) {
                if (int_box[i] == 0) {
                    check = i + 1;
                    break;
                }
            }
            if (check == 1) {
                int_box[0] = 1;
                $(".first_ref").show();
                trace2.showlegend = true;
            } else if (check == 2) {
                int_box[1] = 1;
                $(".second_ref").show();
                trace3.showlegend=true;
            } else if (check == 3) {
                int_box[2] = 1;
                $(".third_ref").show();
                trace4.showlegend=true;
            } else if (check == 4) {
                int_box[3] = 1;
                $(".fourth_ref").show();
                trace5.showlegend=true;
            } else if (check == 5) {
                int_box[4] = 1;
                $(".fifth_ref").show();
                trace6.showlegend=true;
            }
        });

        // 기준선 삭제
        $("#sub_btn_1").click(function () {
            int_box[0] = 0;
            $(".first_ref").hide();
            $("#add1").val('NULL');
            trace2.showlegend=false;
        });
        $("#sub_btn_2").click(function () {
            int_box[1] = 0;
            $(".second_ref").hide();
            $("#add2").val('NULL');
            trace3.showlegend=false;
        });
        $("#sub_btn_3").click(function () {
            int_box[2] = 0;
            $(".third_ref").hide();
            $("#add3").val('NULL');
            trace4.showlegend=false;
        });
        $("#sub_btn_4").click(function () {
            int_box[3] = 0;
            $(".fourth_ref").hide();
            $("#add4").val('NULL');
            trace5.showlegend=false;
        });
        $("#sub_btn_5").click(function () {
            int_box[4] = 0;
            $(".fifth_ref").hide();
            $("#add5").val('NULL');
            trace6.showlegend=false;
        });
    });
}
function plus(){
    ++setVal;
    document.getElementById("set").innerHTML = setVal;
}
function minus(){
    --setVal;
    document.getElementById("set").innerHTML = setVal;
}
function reset(){
    setVal=0;
    document.getElementById("set").innerHTML = setVal;
}
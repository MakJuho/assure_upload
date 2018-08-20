// document.write("<script src='graph.js'></script>");
;window.addEventListener("load", function () {

    "use strict";

    // vec math
    var add = function (a, b) {
        return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
    };
    var sub = function (a, b) {
        return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
    };
    var dot = function (a, b) {
        return a.x*b.x + a.y*b.y + a.z*b.z;
    };
    var cross = function (a, b) {
        return {x: a.y*b.z-a.z*b.y, y: a.z*b.x-a.x*b.z, z: a.x*b.y-a.y*b.x};
    };
    var mul = function (r, v) {
        return {x: r * v.x, y: r * v.y, z: r *v.z};
    };
    var abs = function (a) {
        return Math.sqrt(dot(a, a));
    };

    var data=0;
    var send_acc_x;
    var send_acc_y;
    var send_acc_z;

    var lastX;
    var lastY;
    var lastZ;
    
    
    var speed_float=0;
    var currentTime;
    var lastTime=0;
    var gabOfTime;


    // split vertical/horizontal elements of acceleration
    var time = 0;
    var splitVH = function (ev) {
        var acc = ev.acceleration, accg = ev.accelerationIncludingGravity;
        // calc gravity element
        var g = sub(accg, acc);
        var gl = abs(g);
        var ez = mul(1/gl, g); // unit vector
        // calc vertical(= gravity direction) part
        var vl = dot(acc, ez);
        var v = mul(vl, ez);
        // split horizontal(= orthogonal plane of gravity) part
        var h = sub(acc, v);
        // orthogonal plane elements(y: top-bottom, x: right->left)
        // (as left hand system)
        var ex = cross({x: 0, y: 1, z: 0}, ez);
        var ey = cross(ez, ex);
        var yl = dot(h, ey);
        var xl = dot(h, ex);
        
        send_acc_x = accg.x;
        send_acc_y = accg.y;
        send_acc_z = accg.z;
        
        return {
            a: {x: acc.x, y: acc.y, z: acc.z},
            ag: {x: accg.x, y: accg.y, z: accg.z},
            v: v, h: h, ez: ez, vl: vl, ex: ex, ey: ey, xl: xl, yl: yl
        };
    };

    // Record acceleration data at devicemotion event for views
    // NOTE: not drawing in "devicemotion" event handlers because of delaying
    var lastvh = null;
    var xl = 0.0;
    var yl = 0.0;
    var zlsize = 300;
    var zl1s = new Array(zlsize);
    var zl2s = new Array(zlsize);
    for (var i = 0; i < zlsize; i++) zl1s[i] = zl2s[i] = 0.0; 
    var cur = 0;
    var recordXYZ = function (vh) {
        lastvh = vh;
        xl = 0.9 * xl + 0.1 * vh.xl;
        yl = 0.9 * yl + 0.1 * vh.yl;
        cur = (cur + 1) % zlsize;
        zl1s[cur] = vh.vl;
        zl2s[cur] = 0.9 * zl2s[(zlsize + cur - 1) % zlsize] + 0.1 * vh.vl;
    };
    // Example Application: Simple Walk Counter
    // (state)
    
    // (event handler)
   
    // (view)

    // RESET 버튼
    // var reset = document.getElementById("reset");
    // reset.addEventListener("click", function () {
    //     vl = 0.0;
    //     count = 0;
    //     updown = 0;
    // }, false);
    
    var value = document.getElementById("val");

// 기준선 1 정의 
    var ref_1;

// 기준선 2 정의
    var ref_3;

// 기준선 3 정의
    var ref_5;

// 기준선 4 정의
    var ref_7;

// 기준선 5 정의
    var ref_9;
// 멈추는 조건
    var cond_stop=1;
    var stop_val;
    var check_unit=1; // 1일때 m/s2 0일때 mm/s2
    // 기준선 정보
    var add_val1_acc = document.getElementById("add1_acc");
    var add_val2_acc = document.getElementById("add2_acc");
    var add_val3_acc = document.getElementById("add3_acc");
    var add_val4_acc = document.getElementById("add4_acc");
    var add_val5_acc = document.getElementById("add5_acc");

    var updateValue = function(){
        
        var tmp_vibrate=Math.abs(zl1s[cur]*1000);
        tmp_vibrate=Math.floor(tmp_vibrate);
        
        currentTime = +new Date();
        gabOfTime = (currentTime - lastTime);
        var acc=send_acc_x + send_acc_y + send_acc_z - lastX - lastY - lastZ;

        //m/s2일 때
        if(check_unit==1){
            if (gabOfTime > 100) {
                lastTime = currentTime;
                speed_float = Math.abs(acc) / gabOfTime * 60;
                speed_float = speed_float.toFixed(2);
                if(!(speed_float>0)){

                    speed_float=0;
                }

                lastX = send_acc_x;
                lastY = send_acc_y;
                lastZ = send_acc_z;
            
            }
        
            // x축에 대한 가속도 데시벨
            
             if(cond_stop!=1){
                value.textContent = speed_float; // m/s2
                data = speed_float;
                stop_val = speed_float;


            //    value.textContent = 10.12;
            //    data = 10.12;
            //    stop_val = 10.12;

                if (speed_float >= 0) {
                    document.getElementById("p1").style.color = "white";
                    document.getElementById("p2").style.color = "white";
                    document.getElementById("p3").style.color = "white";
                    document.getElementById("p4").style.color = "white";
                    document.getElementById("p5").style.color = "white";
                    document.getElementById("p6").style.color = "white";

                }

                if (speed_float < 0.02) {
                    document.getElementById("p1").style.color = "red";
                } else if (speed_float < 0.06) {
                    document.getElementById("p2").style.color = "red";
                } else if (speed_float < 0.125) {
                    document.getElementById("p3").style.color = "red";
                } else if (speed_float < 0.4) {
                    document.getElementById("p4").style.color = "red";
                } else if (speed_float < 1) {
                    document.getElementById("p5").style.color = "red";
                } else if (speed_float >= 1) {
                    document.getElementById("p6").style.color = "red";
                }

                ref_1 = add_val1_acc.value;
                ref_3 = add_val2_acc.value;
                ref_5 = add_val3_acc.value;
                ref_7 = add_val4_acc.value;
                ref_9 = add_val5_acc.value;
            }else{
                value.textContent = stop_val;
                data = stop_val;
            }

            // mm/s2일 때
        }else if(check_unit==0){
            if (gabOfTime > 100) {
                lastTime = currentTime;
                speed_float = Math.abs(acc) / gabOfTime * 60000;
                speed_float = Math.floor(speed_float);
                if (!(speed_float > 0)) {

                    speed_float = 0;
                }

                lastX = send_acc_x;
                lastY = send_acc_y;
                lastZ = send_acc_z;

            }

            // x축에 대한 가속도 데시벨

            if (cond_stop != 1) {
                value.textContent = speed_float; // m/s2
                data = speed_float;
                stop_val = speed_float;


                //    value.textContent = 10.12;
                //    data = 10.12;
                //    stop_val = 10.12;

                if (speed_float >= 0) {
                    document.getElementById("p1").style.color = "white";
                    document.getElementById("p2").style.color = "white";
                    document.getElementById("p3").style.color = "white";
                    document.getElementById("p4").style.color = "white";
                    document.getElementById("p5").style.color = "white";
                    document.getElementById("p6").style.color = "white";

                }

                // 이슈발생
                if (speed_float < 20) {
                    document.getElementById("p1").style.color = "red";
                } else if (speed_float < 60) {
                    document.getElementById("p2").style.color = "red";
                } else if (speed_float < 125) {
                    document.getElementById("p3").style.color = "red";
                } else if (speed_float < 400) {
                    document.getElementById("p4").style.color = "red";
                } else if (speed_float < 1000) {
                    document.getElementById("p5").style.color = "red";
                } else if (speed_float >= 1000) {
                    document.getElementById("p6").style.color = "red";
                }

                ref_1 = add_val1_acc.value;
                ref_3 = add_val2_acc.value;
                ref_5 = add_val3_acc.value;
                ref_7 = add_val4_acc.value;
                ref_9 = add_val5_acc.value;
            } else {
                value.textContent = stop_val;
                data = stop_val;
                }
        }
        
    };

    
    

    // Event Handlers
    // see: http://www.w3.org/TR/orientation-event/
    window.addEventListener("devicemotion", function (ev) {
        try {
            var vh = splitVH(ev);


            recordXYZ(vh);
        } catch (ex) {
            document.getElementById("log").textContent = ex.toString();
        }
    }, false); 

    

    requestAnimationFrame(function loop() {

        updateValue();
        requestAnimationFrame(loop);
    });

    // plotly.
    

    var trace1 = {
        x: [time],
        y: [data],
        type: 'line',
        mode: 'lines',
        showlegend: false,
        line: {
            color: 'red',
            width: 5 
        }
    };

   
    
    // 기준선 1
    var trace3 = {
        x: [time],
        y: [ref_1],
        type: 'line',
        name: '기준선1',
        mode: 'lines',
        showlegend: false,
        line: {
            color: 'green',
            width: 5
        }
    }

    // 기준선 2
    var trace5 = {
        x: [time],
        y: [ref_3],
        type: 'line',
        name: '기준선2',
        mode: 'lines',
        showlegend: false,
        line: {
            color: 'yellow',
            width: 5
        }
    }

    // 기준선 3
    var trace7 = {
        x: [time],
        y: [ref_5],
        type: 'line',
        name: '기준선3',
        mode: 'lines',
        showlegend: false,
        line: {
            color: 'blue',
            width: 5
        }
    }

    // 기준선 4
    var trace9 = {
        x: [time],
        y: [ref_7],
        type: 'line',
        name: '기준선4',
        mode: 'lines',
        showlegend: false,
        line: {
            color: 'sky',
            width: 5
        }
    }
    
    // 기준선 5
    var trace11 = {
        x: [time],
        y: [ref_9],
        type: 'line',
        name: '기준선5',
        mode: 'lines',
        showlegend: false,
        line: {
            color: 'orange',
            width: 5
        }
    }

    var chartData = [trace1,trace3,trace5,trace7,trace9,trace11];

// 여기까지
   var layout = {
       title: '실시간 그래프',
       showlegend: true,
       "titlefont": {
           "size": 36,
           "color": 'white'
       },
       legend: {
           font: {
               size: 20,
               color: "white",
           }
       },
       xaxis: {
           range:[0,30],
           color: "white",
           showgrid: true,
           gridcolor: "grey",
           gridwidth: 0.3,
           zeroilne: true,
           zerolinecolor: "white",
           zerolinewidth: 3,
           showticklabels: true,
           tickfont: {
               size: 23,
               color: 'white'
           },
       },
       yaxis: {
           color: "white",
           showgrid: true,
           zeroilne: true,
           gridcolor: "white",
           gridwidth: 1,
           zerolinecolor: "white",
           zerolinewidth: 3,
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
    
    
    Plotly.newPlot('chart', chartData, layout,
    { 
        displaylogo: false, 
        modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'toImage', 'sendDataToCloud', 'resetScale2d', 'hoverClosestCartesian', 'toggleSpikelines', 'hoverCompareCartesian', 'zoom2d']
    }
    );
  

    var cnt = 0;
    var mainFrame = document.getElementById("val");
    var createFrame = document.createElement("div");


    // var trace1 = {
    //     x: [time],
    //     y: [data],
    //     type: 'line',
    //     mode: 'lines',
    //     showlegend: false,
    //     line: {
    //         color: 'red',
    //         width: 5
    //     }
    // };
    var color_update = {
        type: 'line',
        mode: 'lines',
        showlegend: false,
        line: {
            color: 'red',
            width: 5
        }
    };
    var color_update1={
        type: 'line',
        mode: 'lines',
        showlegend: true,
        name: '기준선1',
        line: {
            color: 'green',
            width: 5
        }
    }
    var color_update2 = {
        type: 'line',
        mode: 'lines',
        showlegend: true,
        name: '기준선2',
        line: {
            color: 'yellow',
            width: 5
        }
    }
    var color_update3 = {
        type: 'line',
        mode: 'lines',
        showlegend: true,
        name: '기준선3',
        line: {
            color: 'blue',
            width: 5
        }
    }
    var color_update4 = {
        type: 'line',
        mode: 'lines',
        showlegend: true,
        name: '기준선4',
        line: {
            color: 'sky',
            width: 5
        }
    }
    var color_update5 = {
        type: 'line',
        mode: 'lines',
        showlegend: true,
        name: '기준선5',
        line: {
            color: 'orange',
            width: 5
        }
    }

    // myFunction();
    var myVar 
    function initializer_traces() {
        
    }
    function myFunction(){
        myVar= setInterval(function(){myTimer()}, 100);
    }
    function myStopFunction() {
        clearInterval(myVar);
    }
    var update;

    
    function myTimer()
    {
        time +=0.1;
        update={
            x: [
                [time],
                [time],
                [time],
                [time],
                [time],
                [time]
                ],
            y: [
                [data],
                [ref_1],
                [ref_3],
                [ref_5],
                [ref_7],
                [ref_9]
            ]
        }


        Plotly.extendTraces('chart', update, [0, 1, 2, 3, 4, 5]);
        cnt += 1;

        createFrame.innerHTML = data;
        mainFrame.appendChild(createFrame);

        if (cnt > 300) {
            Plotly.relayout('chart', {
                xaxis: {

                    range: [time-30, time],
                    color: "white",
                    showgrid: true,
                    gridcolor: "grey",
                    gridwidth: 0.1,
                    zeroilne: true,
                    zerolinecolor: "white",
                    zerolinewidth: 3,
                    showticklabels: true,
                    tickfont: {
                        size: 23,
                        color: 'white'
                    },
                },
                yaxis: {
                    color: "white",
                    showgrid: true,
                    zeroilne: true,
                    gridcolor: "white",
                    gridwidth: 1,
                    zerolinecolor: "white",
                    zerolinewidth: 3,
                    showticklabels: true,
                    tickfont: {
                        size: 23,
                        color: 'white'
                    },
                },
            })
        }
    }

// [0,0,0,0,0] 으로 배열 초기화
var int_box = Array.apply(null, new Array(5)).map(Number.prototype.valueOf, 0);

var check = 0;
// 버튼 클릭 할 때
$(document).ready(function () {
    // 추가 기준선 5
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
            trace3.showlegend=true;

        } else if (check == 2) {
            int_box[1] = 1;
            $(".second_ref").show();
            trace5.showlegend = true;

        } else if (check == 3) {
            int_box[2] = 1;
            $(".third_ref").show();
            trace7.showlegend = true;

        } else if (check == 4) {
            int_box[3] = 1;
            $(".fourth_ref").show();
            trace9.showlegend = true;

        } else if (check == 5) {
            int_box[4] = 1;
            $(".fifth_ref").show();
            trace11.showlegend = true;

        }
    });

    // 삭제 기준선 5
    $("#sub_btn_1").click(function () {
        int_box[0] = 0;
        $(".first_ref").hide();
        $("#add1_acc").val('NULL');
        // $("#add1_sum_acc").val('NULL');
        trace3.showlegend = false;

    });

    $("#sub_btn_2").click(function () {
        int_box[1] = 0;
        $(".second_ref").hide();
        $("#add2_acc").val('NULL');
        // $("#add2_sum_acc").val('NULL');
        trace5.showlegend = false;

    });

    $("#sub_btn_3").click(function () {
        int_box[2] = 0;
        $(".third_ref").hide();
        $("#add3_acc").val('NULL');
        // $("#add3_sum_acc").val('NULL');
        trace7.showlegend = false;
    });

    $("#sub_btn_4").click(function () {
        int_box[3] = 0;
        $(".fourth_ref").hide();
        $("#add4_acc").val('NULL');
        // $("#add4_sum_acc").val('NULL');
        trace9.showlegend = false;

    });

    $("#sub_btn_5").click(function () {
        int_box[4] = 0;
        $(".fifth_ref").hide();
        $("#add5_acc").val('NULL');
        // $("#add5_sum_acc").val('NULL');
        trace11.showlegend = false;
    });
 
    $("#play_btn").click(function () {
        $("#play_btn").hide();
        $("#pause_btn").show();
        myFunction();
        cond_stop=0;
    })

    $("#pause_btn").click(function () {
        $("#pause_btn").hide();
        $("#play_btn").show();
        myStopFunction();
        cond_stop=1;
    })

    $("#mm_btn").click(function () {
        $("#mm_btn").hide();
        $("#m_btn").show();
        $("#mm_s2").show();
        $("#m_s2").hide();

        Plotly.deleteTraces('chart', 0);
        Plotly.addTraces('chart', update, 0);
        Plotly.restyle('chart', color_update,0);

        Plotly.deleteTraces('chart', 1);
        Plotly.addTraces('chart', update, 1);
        Plotly.restyle('chart', color_update1, 1);

        Plotly.deleteTraces('chart', 2);
        Plotly.addTraces('chart', update, 2);
        Plotly.restyle('chart', color_update2, 2);

        Plotly.deleteTraces('chart', 3);
        Plotly.addTraces('chart', update, 3);
        Plotly.restyle('chart', color_update3, 3);

        Plotly.deleteTraces('chart', 4);
        Plotly.addTraces('chart', update, 4);
        Plotly.restyle('chart', color_update4, 4);

        Plotly.deleteTraces('chart', 5);
        Plotly.addTraces('chart', update, 5);
        Plotly.restyle('chart', color_update5, 5);

        time = 0;
        Plotly.relayout('chart', {
            xaxis: {
                range: [time, time+30],
                color: "white",
                showgrid: true,
                gridcolor: "grey",
                gridwidth: 0.3,
                zeroilne: true,
                zerolinecolor: "white",
                zerolinewidth: 3,
                showticklabels: true,
                tickfont: {
                    size: 23,
                    color: 'white'
                },
            },
            yaxis: {
                color: "white",
                showgrid: true,
                zeroilne: true,
                gridcolor: "white",
                gridwidth: 1,
                zerolinecolor: "white",
                zerolinewidth: 3,
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
            }
        })

        initializer_traces();
        time=0;
        cnt=0;
        check_unit = 0;
    })
    $("#m_btn").click(function () {
        $("#m_btn").hide();
        $("#mm_btn").show();
        $("#m_s2").show();
        $("#mm_s2").hide();

        Plotly.deleteTraces('chart', 0);
        Plotly.addTraces('chart', update, 0);
        Plotly.restyle('chart', color_update, 0);

        Plotly.deleteTraces('chart', 1);
        Plotly.addTraces('chart', update, 1);
        Plotly.restyle('chart', color_update1, 1);

        Plotly.deleteTraces('chart', 2);
        Plotly.addTraces('chart', update, 2);
        Plotly.restyle('chart', color_update2, 2);

        Plotly.deleteTraces('chart', 3);
        Plotly.addTraces('chart', update, 3);
        Plotly.restyle('chart', color_update3,3);

        Plotly.deleteTraces('chart', 4);
        Plotly.addTraces('chart', update, 4);
        Plotly.restyle('chart', color_update4,4);

        Plotly.deleteTraces('chart', 5);
        Plotly.addTraces('chart', update, 5);
        Plotly.restyle('chart', color_update5,5);

        time = 0;
        Plotly.relayout('chart', {
            xaxis: {

                range: [time, time+30],
                color: "white",
                showgrid: true,
                gridcolor: "grey",
                gridwidth: 0.1,
                zeroilne: true,
                zerolinecolor: "white",
                zerolinewidth: 3,
                showticklabels: true,
                tickfont: {
                    size: 23,
                    color: 'white'
                },
            },
            yaxis: {
                color: "white",
                showgrid: true,
                zeroilne: true,
                gridcolor: "white",
                gridwidth: 1,
                zerolinecolor: "white",
                zerolinewidth: 3,
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
                }
        })

        initializer_traces();
        
        
        cnt=0;
        check_unit = 1;
    })
    
});
}, false);

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

    var gabOfTime;
    var currentTime;
    var lastTime=0;
    

    var gabOfTime;
    // 내가 짠 부분
    var calculate_val = function () {

        currentTime=+ new Date();
        gabOfTime= (currentTime-lastTime);

        if(gabOfTime>100){
            lastTime=currentTime;   
            speed_float= Math.abs(send_acc_x+send_acc_y+send_acc_z-lastX-lastY-lastZ) / gabOfTime*10000;
            speed_float=Math.floor(speed_float);
            lastX = send_acc_x;
            lastY = send_acc_y;
            lastZ = send_acc_z;
        }

        return speed_float;
    }
    var time_knowing = function(){
        var time =+ new Date();
        return time;
    }

    // split vertical/horizontal elements of acceleration
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
    
    // view of direct event acceleration values
    var v1 = {
        x: document.getElementById("x1"),
        y: document.getElementById("y1"),
        z: document.getElementById("z1"),
        abs: document.getElementById("abs1"),
        xn: document.getElementById("x1n"),
        yn: document.getElementById("y1n"),
        zn: document.getElementById("z1n"),
        absn: document.getElementById("abs1n"),
    };
    var v2 = {
        x: document.getElementById("x2"),
        y: document.getElementById("y2"),
        z: document.getElementById("z2"),
        abs: document.getElementById("abs2"),
        xn: document.getElementById("x2n"),
        yn: document.getElementById("y2n"),
        zn: document.getElementById("z2n"),
        absn: document.getElementById("abs2n"),
    };
    var showAccel = function (v, accel) {
        v.x.value = v.xn.value = accel.x;
        v.y.value = v.yn.value = accel.y;
        v.z.value = v.zn.value = accel.z;
        v.abs.value = v.absn.value = abs(accel);
    };

    // view of vertical/horizontal elements in acceleration
    var vhview = {
        v: document.getElementById("v"),
        vn: document.getElementById("vn"),
        h: document.getElementById("h"),
        hn: document.getElementById("hn"),
    };
    var showVH = function (vh) {
        vhview.v.value = vhview.vn.value = Math.abs(vh.vl);
        vhview.h.value = vhview.hn.value = abs(vh.h);
    };

    // x-y accel view
    var xyview = document.getElementById("xyview");
    var drawXY = function (vh) {
        var c2d = xyview.getContext("2d");
        var w = xyview.width, h = xyview.height, unit = w / 20;
        c2d.clearRect(0, 0, w, h);
        c2d.save();
        c2d.beginPath();
        c2d.arc(w/2, h/2, unit * 5, 0, 2*Math.PI);
        c2d.strokeStyle = "black";
        c2d.lineWidth = 3;
        c2d.stroke();
        c2d.restore();
        c2d.save();
        c2d.translate(w/2, h/2);
        c2d.beginPath();
        c2d.moveTo(0, 0);
        c2d.lineTo(vh.xl * -unit, vh.yl * unit);
        c2d.strokeStyle = "red";
        c2d.lineWidth = 3;
        c2d.stroke();
        c2d.beginPath();
        c2d.moveTo(0, 0);
        c2d.lineTo(xl * -unit, yl * unit);
        c2d.strokeStyle = "blue";
        c2d.lineWidth = 3;
        c2d.stroke();
        c2d.restore();
    };
    // z accel view

    var zview = document.getElementById("zview");
    var drawZ = function (vh) {
        var c2d = zview.getContext("2d");
        var w = zview.width, h = zview.height;
        c2d.clearRect(0, 0, w, h);
        c2d.lineWidth = 2;
        c2d.beginPath();
        c2d.moveTo(0, h/2);
        c2d.lineTo(w, h/2);
        c2d.strokeStyle = "black";
        c2d.stroke();
        drawChart(c2d, zl1s, "red");
        drawChart(c2d, zl2s, "blue");
    };


    var drawChart = function (c2d, data, stroke) {
        var start = (cur + 1) % zlsize;
        var x = 0;
        var dx = zview.width / zlsize;
        var unit = zview.height / 20, center = zview.height / 2;
        c2d.beginPath();
        c2d.moveTo(x, center + data[start] * -unit);
        for (var i = (start + 1) % zlsize; i < zlsize; i++) {
            x += dx;
            c2d.lineTo(x, center + data[i] * -unit);
        }
        for (var i = 0; i < start; i++) {
            x += dx;
            c2d.lineTo(x, center + data[i] * -unit);
        }
        c2d.strokeStyle = stroke;
        c2d.stroke();
    };


    // Example Application: Simple Walk Counter
    // (state)
    var updown = 0;
    var vl = 0.0; // noise filtered value
    var count = 0;
    var thresholds = {up: 0.25, down: -0.25};
    // (event handler)
    var walking = function (vh) {
        vl = 0.9 * vl + 0.1 * vh.vl; //low-pass filtering
        switch (updown){
        case -1:
            if (vl > thresholds.up) {
                updown = +1;
                count += 1;
            }
            break;
        case +1:
            if (vl < thresholds.down) {
                updown = -1;
            }
            break;
        default:
            if (vl < 0) updown = -1;
            if (vl >= 0) updown = +1;
            break;
        }
    };
    // (view)
    var counter = document.getElementById("counter");
    var updateWalking = function () {
        counter.textContent = count;
    };
    var reset = document.getElementById("reset");
    reset.addEventListener("click", function () {
        vl = 0.0;
        count = 0;
        updown = 0;
    }, false);
    
    var value = document.getElementById("val");
    var text = document.getElementById("right");

    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    var slider2 = document.getElementById("myRange2");
    var output2 = document.getElementById("demo2");
    var ref_1;
    var ref_2;
    var updateValue = function(){
        
        var tmp_vibrate=Math.abs(zl1s[cur]*1000);
        tmp_vibrate=Math.floor(tmp_vibrate);
        
        currentTime = +new Date();
        gabOfTime = (currentTime - lastTime);
        var acc=send_acc_x + send_acc_y + send_acc_z - lastX - lastY - lastZ

        if (gabOfTime > 100) {
            lastTime = currentTime;
            speed_float = Math.abs(acc) / gabOfTime * 60000;
            speed_float = Math.floor(speed_float);
            if(!(speed_float>0)){
                speed_float=0;
            }

            lastX = send_acc_x;
            lastY = send_acc_y;
            lastZ = send_acc_z;
        
        }
        if (!(speed_float > 0)) {
            speed_float = 0;
        }
        // x축에 대한 가속도 데시벨
     
        // var result_x = 20 * Math.log10(Math.abs(send_acc_x) * 100000);
        // var result_y = 20 * Math.log10(Math.abs(send_acc_y) * 100000);
        // var result_z = 20 * Math.log10(Math.abs(send_acc_z-9.8) * 100000);

        // var final_val = (result_x + result_y + result_z) / 3
        // if(!(speed_float>0)){
        //     value.textContent = 0 + " mm/s2";
        //     data = 0;
        // }
       
        value.textContent = speed_float + " mm/s2";
        data = speed_float;

        
        // 출력부분

        // 값은 tmp_vibrate로 넘겨준다.
        // id 하나를 지정하고 거기에 값을 넣어준다.

        if (speed_float < 10) {
            text.textContent = "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
                + "지각하지 못함";
        } else if (speed_float < 40) {
            text.textContent = "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
                + "약간 지각";
        } else if (speed_float < 125) {
            text.textContent = "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
                + "확실히 지각";
        } else if (speed_float < 400) {
            text.textContent = "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0" +
                "짜증을 일으킴";
        } else if (speed_float < 1000) {
            text.textContent = "지속되면 고통스러움";
        } else if (speed_float >=1000) {
            text.textContent = "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
            +"해를 끼침";
        } else{
            text.textContent = "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
             + "인지 안됨";
            // text.textContent = "불쾌하고 지속되면 고통스러움";
        }
        // 슬라이드 바

        
        output.innerHTML = slider.value;
        output2.innerHTML = slider2.value;

        slider.oninput = function () {
            output.innerHTML = this.value;
        }

        slider2.oninput = function () {
            output2.innerHTML = this.value;
        }

        ref_1 = slider.value;
        ref_2 = slider2.value;
    };

    
    

    // Event Handlers
    // see: http://www.w3.org/TR/orientation-event/
    window.addEventListener("devicemotion", function (ev) {
        try {
            var vh = splitVH(ev);

            walking(vh);
            recordXYZ(vh);


        } catch (ex) {
            document.getElementById("log").textContent = ex.toString();
        }
    }, false); 

    requestAnimationFrame(function loop() {
        updateWalking();
        updateValue();
        if (lastvh) {
            showAccel(v1, lastvh.a);
            showAccel(v2, lastvh.ag);
            showVH(lastvh);
            drawXY(lastvh);
            drawZ(lastvh);
        }
        requestAnimationFrame(loop);
    });
    
    

    // plotly.
    

    var trace1 = {
        y: [data],
        type: 'line'
    };

    var trace2 = {
        y: [data],
        type: 'line'
    }
    
    var trace3 = {
        y: [ref_1],
        type: 'line'
    }
    var trace4 = {
        y: [ref_2],
        type: 'line'
    }

    var chartData = [trace1,trace3];
    var chartData2 = [trace2,trace4];



    var layout = {
        
        title: '진동값',
        showlegend: false,
        "titlefont":{
            "size": 36,
            "color": '#31708f'
        }
    };
    
    var layout2 = {
        title: '누적 진동값',
        showlegend: false,
         "titlefont": {
             "size": 36,
             "color": '#31708f'
         }
    };
    Plotly.newPlot('chart', chartData, layout,
        { displaylogo: false, 
        modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'toImage', 'sendDataToCloud', 'resetScale2d', 'hoverClosestCartesian', 'toggleSpikelines', 'hoverCompareCartesian', 'zoom2d']}
            
        );
    // var reference_arr=new Array();
    // while(){
    //     reference_arr.push(40);
    // }
    // Plotly.addTraces('chart', {
    //     y:reference_arr
    // });
    // Plotly.plot('chart', [{
    // y: [data],
    // type: 'line'
    // }]);


    Plotly.newPlot('chart2', chartData2, layout2,
        {
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d','select2d', 'lasso2d', 'toImage', 'sendDataToCloud', 'resetScale2d', 'hoverClosestCartesian', 'toggleSpikelines', 'hoverCompareCartesian', 'zoom2d']
            
        });
    // Plotly.restyle('chart2',)
    // Plotly.plot('chart2', [{
    // y: [data],
    // type: 'line'
    // }]);

    var cnt = 0;
    var mainFrame = document.getElementById("val");
    var createFrame = document.createElement("div");

    setInterval(function () {

        Plotly.extendTraces('chart', {
            y: [[data],[ref_1]]
        }, [0,1]);
        Plotly.extendTraces('chart', {
        y: [[(-1) * data],[ref_1]]
        }, [0,1]);
        cnt += 2;

        createFrame.innerHTML = data;
        mainFrame.appendChild(createFrame);

        if (cnt > 30) {
        Plotly.relayout('chart', {
            xaxis: {
            range: [cnt - 30, cnt]
            }
        })
        }
        }, 200);

        setInterval(function () {
        Plotly.extendTraces('chart2', {
            y: [
            [data],[ref_2]
            ]
        }, [0,1]);
    }, 200);


}, false);



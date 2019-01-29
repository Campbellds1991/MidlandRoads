window.onload = function () {
    //canvas init
    var bg = document.getElementsByClassName("content_bg")[0];
    bg.parentElement.style.position = "relative";
    var newCanvas = document.createElement('canvas');
    newCanvas.style = "width:100%;height:100%;position:absolute;margin:0;";
    newCanvas.id = "snow";
    bg.parentNode.insertBefore(newCanvas, bg);
    var canvas = document.getElementById("snow");
    var ctx = canvas.getContext("2d");
    //console.log(ctx);

    //canvas dimensions
    //console.log(canvas.clientHeight);
    //console.log(canvas.clientWidth);
    var W = canvas.clientWidth;
    var H = canvas.clientHeight;
    canvas.width = W;
    canvas.height = H;

    var percentSideFall = .5;

    var ScaleFactor = .3;
    var Arc = Math.log2(W) * ScaleFactor;
    console.log(Arc);

    var mp = Math.sqrt(H * W); //max particles
    console.log(mp);
    var particles = [];

    function initializeSnow() {
        particles = [];
        for (var i = 0; i < mp; i++) {
            var scaler = Math.random();
            particles.push({
                x: Math.random() * W, //x-coordinate
                y: Math.random() * H, //y-coordinate
                r: scaler * Arc + 1, //radius 1                          
                d: Math.random() * mp //density
            })
        }
    }

    initializeSnow();
    //snowflake particles

    //console.log(particles);

    //Lets draw the flakes
    function draw() {
        ctx.clearRect(0, 0, W, H);

        ctx.fillStyle = "rgba(172,215,251, 0.6)";
        ctx.beginPath();
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            ctx.moveTo(p.x, p.y)
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
        update();

    }

    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    var angle = 0;
    function update() {
        angle += 0.01;
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(angle) * 2;

            //Sending flakes back from the top when it exits
            //Lets make it a bit more organic and let flakes enter from the left and right also.
            if (p.x > W * 1.1 || p.x < W * -.1 || p.y > H) {
                if (i % W > H / ((Math.abs(Math.sin(angle)) * 2) + 4)) //66.66% of the flakes
                {
                    particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d };
                }
                else {
                    //If the flake is exitting from the right
                    if (Math.sin(angle) > 0) {
                        //Enter from the left
                        particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d };
                    }
                    else {
                        //Enter from the right
                        particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d };
                    }
                }
            }
        }
        if (angle > 4 * Math.PI) { angle = angle - 2 * Math.PI }
    }
    //animation loop
    setInterval(draw, 40);
    window.onresize = function () {
        console.log("window resized")
        W = canvas.clientWidth;
        H = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        initializeSnow();
    };

    function reportParticles() {
        return particles;
    }
}



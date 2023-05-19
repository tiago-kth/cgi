class Particle {

    vx;
    vy;
    x;
    y;
    x0;
    y0;
    canvas;
    alpha;
    decay;
    color;

    constructor(x, y, canvas) {

        this.canvas = canvas;
        this.alpha = 1;

        this.color = 'turquoise'; //`rgb(0, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;

        this.decay = Math.random() / 1000 + 0.005;

        this.x = x;
        this.y = y;

        this.x0 = x;
        this.y0 = y;

        

        this.getVelocity();

        /*
        console.log(this.vx, this.vy);
        this.vx += vx0 * 10;
        this.vy += vy0 * 10;
        console.log(this.vx, this.vy);
        */


        this.xmax = canvas.W;
        this.ymax = canvas.H;

    }

    getCell() {

        const cell_size = this.canvas.cell_size;

        return {

            i : Math.floor(this.x / cell_size),
            j : Math.floor(this.y / cell_size)

        }

    }

    getVelocity() {

        const {i, j} = this.getCell();

        const n = fluid.getIndex(i, j);
        
        this.vx = fluid.Vx[n];
        this.vy = fluid.Vy[n];


    }

    update() {

        const dt = params.TIME_STEP;
        const cell_size = cv.cell_size;

        this.getVelocity();

        this.alpha = (1 - this.decay) * this.alpha;

        this.x0 = this.x;
        this.y0 = this.y;

        this.x += this.vx * dt * params.SPEED_INCREMENT * 100;
        this.y += this.vy * dt * params.SPEED_INCREMENT * 100;

        //console.log(this.vx, this.vx * dt * params.SPEED_INCREMENT * 100);

        if (this.x > this.xmax - 1.5 * cell_size || this.x < cell_size) {

            this.x -= this.vx * dt * params.SPEED_INCREMENT * 100;

        }

        if (this.y > this.ymax - 1.5 * cell_size || this.y < cell_size) {

            this.y -= this.vy * dt * params.SPEED_INCREMENT * 100;

        }


    }

    render() {

        //cv.ctx.strokeStyle = 'cyan';
        cv.ctx.fillStyle = this.color;//'blue';
        cv.ctx.lineWidth = 8;
        cv.ctx.beginPath();
        cv.ctx.globalAlpha = this.alpha;
        //cv.ctx.moveTo(this.x0, this.y0);
        cv.ctx.arc(this.x, this.y, 4, 0, Math.PI);
        //cv.ctx.lineTo(this.x, this.y);
        cv.ctx.fill();
        cv.ctx.closePath();
        //cv.ctx.stroke();

    }

    step() {

        this.update();
        this.render();

    }


}

let particles = [];

const Np = 20;

function generate_particles(N, x0, y0) {

    for (let theta = 0; theta < Math.PI * 2; theta += Math.PI * 2 / N) {

        const v = Vec.fromAngle(theta);

        //console.log(v);

        const new_p = new Particle(x0 + v.x * cv.cell_size, y0 + v.y * cv.cell_size, cv);

        particles.push(new_p);

    }

}
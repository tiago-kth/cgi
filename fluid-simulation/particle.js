class Particle {

    vx;
    vy;
    x;
    y;
    x0;
    y0;
    canvas

    constructor(x, y, canvas) {

        this.canvas = canvas;

        this.x = x;
        this.y = y;

        this.x0 = x;
        this.y0 = y;

        this.vx = 100;
        this.vy = 100;

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

        cv.ctx.strokeStyle = 'cyan';
        cv.ctx.lineWidth = 8;
        cv.ctx.beginPath();
        cv.ctx.moveTo(this.x0, this.y0);
        cv.ctx.lineTo(this.x, this.y);
        cv.ctx.closePath();
        cv.ctx.stroke();

    }

    step() {

        this.update();
        this.render();

    }



}
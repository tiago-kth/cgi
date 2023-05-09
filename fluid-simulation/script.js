const params = {
    DIFFUSION: null,
    VISCOSITY: null,
    TIME_STEP: null,
    ITERATIONS: 4
}

class Canvas {

    cell_size = 30;
    W;
    H;
    I;
    J;

    N;

    constructor(ref) {

        this.el = document.querySelector(ref);
        this.W = +window.getComputedStyle(this.el).width.slice(0,-2);
        this.H = +window.getComputedStyle(this.el).height.slice(0,-2);

        this.el.width = this.W;
        this.el.height = this.H;

        this.I = Math.floor(this.W / this.cell_size);
        this.J = Math.floor(this.H / this.cell_size);

        this.N = this.I;

        this.ctx = this.el.getContext('2d');

        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 1;

    }

    build_grid() {

        //let I = 0;
        //let J = 0;

        for (let i = 0; i < this.W; i = i + this.cell_size) {

            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.H);
            this.ctx.stroke();
            //I++

        }

        for (let j = 0; j < this.H; j = j + this.cell_size) {

            this.ctx.beginPath();
            this.ctx.moveTo(0, j);
            this.ctx.lineTo(this.W, j);
            this.ctx.stroke();
            //J++

        }

        //this.I = I;
        //this.J = J;

    }

    getDims() {

        return {
            I: this.I,
            J: this.J
        }

    }

    getSize() {

        return this.I * this.J;

    }

}

class Vec {

    x;
    y;

    constructor(x, y) {

        this.x = x;
        this.y = y;

    }

    mod() {

        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) )

    }

    add(vec_b) {

        this.x += vec_b.x;
        this.y += vec_b.y

    }

    mult(scalar) {

        this.x *= scalar;
        this.y *= scalar;

    }

    /* this make it possible to use the utility function without instantiating an object */
    static fromAngle(ang) {

        let x = Math.cos(ang);
        let y = Math.sin(ang);

        return new Vec(x, y)

    }

}

class Fluid {

    Vx; Vy  // vector field for velocity
    Vx0; Vy0 // previous velocity
    s;  // vector field for dye/plankton density
    density; // previous density?

    diffusion;
    viscosity;
    dt; // time_step

    constructor(diffusion, viscosity, time_step) {

        const size = N * N;

        this.Vx  = new Array(size).fill(0);
        this.Vx0 = new Array(size).fill(0);

        this.Vy  = new Array(size).fill(0);
        this.Vy0 = new Array(size).fill(0);

        this.s  = new Array(size).fill(0);
        this.density = new Array(size).fill(0);

        this.viscosity = viscosity;
        this.diffusion = diffusion;
        this.dt = time_step;

    }

    getIndex(x, y) {

        return x + y * N; //nof columns

    }

    addDensity(x, y, amount) {

        const index = this.getIndex(x, y);
        this.density[index] += amount;

    }

    addVelocity(x, y, amount_x, amount_y) {

        if (count < 500) {
            console.log(amount_x, amount_y);
            count++;

        }

        const index = this.getIndex(x, y);
        this.Vx[index] += amount_x;
        this.Vy[index] += amount_y;

    }

    step() {

        const N       = this.size;
        const visc    = this.viscosity;
        const diff    = this.diffusion;
        const dt      = this.dt;

        const Vx      = this.Vx;
        const Vy      = this.Vy;

        const Vx0     = this.Vx0;
        const Vy0     = this.Vy0;

        const s       = this.s;
        const density = this.density;
        
        diffuse(1, Vx0, Vx, visc);
        diffuse(2, Vy0, Vy, visc);
        
        project(Vx0, Vy0, Vx, Vy);
        
        
        advect(1, Vx, Vx0, Vx0, Vy0);
        advect(2, Vy, Vy0, Vx0, Vy0);
        
        project(Vx, Vy, Vx0, Vy0);
        
        //diffuse(0, s, density, diff);
        //advect(0, density, s, Vx, Vy);
        

    }

    render_density() {

        for (let i = 0; i < N; i++) {

            for (let j = 0; j < N; j++) {

                const x = i * cv.cell_size;
                const y = j * cv.cell_size;
                const index = fluid.getIndex(i, j);
                const density = fluid.density[index];

                //if (density > 0) console.log(i,j);

                cv.ctx.fillStyle = (`rgb(0, ${density}, ${density})`);
                //cv.ctx.fillStyle = 'hotpink';
                cv.ctx.fillRect(x, y, cv.cell_size, cv.cell_size);
                //if (i + j < 100) console.log(x, y, cv.cell_size);
                
                
                //cv.ctx.fillStyle = (`rgb(${density}, ${density}, ${density})`);
                //cv.ctx.fill();

            }

        }

    }

}



/////////////

let count = 0;

const cv = new Canvas('canvas');
const N = cv.N;
const fluid = new Fluid(0.2, 0, 0.1);

let dragging = false;
let mouse_history_x = [];
let mouse_history_y = [];

function update_mouse_history(posX, posY) {

    mouse_history_x.push(posX);
    mouse_history_y.push(posY);

    if (mouse_history_x.length < 2) {

        mouse_history_x.push(posX);
        mouse_history_y.push(posY);

    } else {

        mouse_history_x.splice(0,1);
        mouse_history_y.splice(0,1);

    }

    // I want to keep this arrays as [previous_position, current_position];

}

cv.el.addEventListener('mousedown', (e) => {

    console.log('on');
    dragging = true;

});

cv.el.addEventListener('mousemove', (e) => {

    if (dragging) {
        //console.log(e.clientX, e.clientY);

        const i = Math.floor(e.clientX / cv.cell_size);
        const j = Math.floor(e.clientY / cv.cell_size);

        update_mouse_history(e.clientX, e.clientY);

        const displ_x = mouse_history_x[1] - mouse_history_x[0];
        const displ_y = mouse_history_y[1] - mouse_history_y[0];

        console.log(i, j);
        fluid.addDensity(i, j, 20);
        fluid.addVelocity(i, j, displ_x, displ_y);

    }

});

cv.el.addEventListener('mouseup', (e) => {

    console.log('off');
    dragging = false;

});

function draw() {
    fluid.step();
    fluid.render_density();
}


/* animation loop */
let previous, elapsed;

function animate(timestamp) {

    if (!previous) previous = timestamp;
    elapsed = timestamp - previous;
    draw();
    previous = timestamp;
    window.requestAnimationFrame(animate);

}

function start() {
    window.requestAnimationFrame(animate);
}

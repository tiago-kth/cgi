class Canvas {

    cell_size = 30;
    W;
    H;
    I;
    J;

    constructor(ref) {

        this.el = document.querySelector(ref);
        this.W = +window.getComputedStyle(this.el).width.slice(0,-2);
        this.H = +window.getComputedStyle(this.el).height.slice(0,-2);

        this.el.width = this.W;
        this.el.height = this.H;

        this.I = Math.floor(this.W / this.cell_size);
        this.J = Math.floor(this.H / this.cell_size);

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

}

class Field {

    I;
    J;

    values = [];

    cv;


    constructor(cv) {

        this.cv = cv;

        const I = cv.I;
        const J = cv.J;

        this.I = I;
        this.J = J;

        for (let i = 0; i < I; i++) {
            for (let j = 0; j < J; j++) {

                this.values.push(
                    perlin.get(i/I,j/J)//Math.random() 
                    * Math.PI);

            }
        }

    }

    getValue(i, j) {

        const n = i + j * this.I;

        return this.values[n];

    }

    getCoords(n) {

        return {
            i : n % this.I,
            j : Math.floor( n / this.I )
        }

    }

    drawVectors() {

        this.values.forEach( (v, n) => {

            const i = this.getCoords(n).i;
            const j = this.getCoords(n).j;

            this.cv.ctx.save();
            this.cv.ctx.translate(i * this.cv.cell_size + this.cv.cell_size/2, j * this.cv.cell_size + this.cv.cell_size/2);
            this.cv.ctx.save();
            this.cv.ctx.rotate(v);
            this.cv.ctx.textAlign = 'center';
            this.cv.ctx.textBaseline = 'middle';
            this.cv.ctx.fillText('→', 0, 0, this.cv.cell_size);

            /*
            this.cv.ctx.beginPath();
            this.cv.ctx.moveTo(0,0);
            this.cv.ctx.rotate(v);
            this.cv.ctx.lineTo(0,   this.cv.cell_size/2);
            //this.cv.ctx.lineTo(this.cv.cell_size * 2/8, this.cv.cell_size * 1/8);
            //this.cv.ctx.moveTo(0,   this.cv.cell_size/2);
            //this.cv.ctx.lineTo(this.cv.cell_size * 2/6, -this.cv.cell_size * 1/6);
            this.cv.ctx.stroke();
            */
            this.cv.ctx.restore();
            /*
            this.cv.ctx.fillRect(this.cv.cell_size/4, this.cv.cell_size/4, this.cv.cell_size/2, this.cv.cell_size/2);
            this.cv.ctx.fill();
            */

            /*
            if (n < 50) {
                console.log(n, i, j);
                this.cv.ctx.fillText(n, 0, this.cv.cell_size);
            }
            */

            this.cv.ctx.restore();


        })

    }

    drawVectors2() {

        this.values.forEach( (v, n) => {

            const i = this.getCoords(n).i;
            const j = this.getCoords(n).j;

            this.cv.ctx.save();
            this.cv.ctx.translate(
                i * this.cv.cell_size,// + this.cv.cell_size/2, 
                j * this.cv.cell_size //+ this.cv.cell_size/2
            );
            this.cv.ctx.rotate(v);//Math.PI/6);
            this.cv.ctx.beginPath();
            this.cv.ctx.moveTo(0,0);
            this.cv.ctx.lineTo(this.cv.cell_size, 0);
            this.cv.ctx.lineTo(this.cv.cell_size * 0.8, this.cv.cell_size * 0.2);
            this.cv.ctx.moveTo(this.cv.cell_size, 0);
            this.cv.ctx.lineTo(this.cv.cell_size * 0.8, -this.cv.cell_size * 0.2);
            this.cv.ctx.stroke();
            this.cv.ctx.restore();

        })

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

const cv = new Canvas('canvas');
const field = new Field(cv);
cv.build_grid();
field.drawVectors();

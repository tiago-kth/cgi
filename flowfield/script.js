class Canvas {

    cell_size = 10;
    W;
    H;

    constructor(ref) {

        this.el = document.querySelector(ref);
        this.W = +window.getComputedStyle(this.el).width.slice(0,-2);
        this.H = +window.getComputedStyle(this.el).height.slice(0,-2);

        this.el.width = this.W;
        this.el.height = this.H;

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

        const I = Math.floor(cv.W / cv.cell_size);
        const J = Math.floor(cv.H / cv.cell_size);

        this.I = I;
        this.J = J;

        for (let i = 0; i < I; i++) {
            for (let j = 0; j < J; j++) {

                this.values.push(Math.random() * Math.PI);

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
            this.cv.ctx.fillText('→', 0, 0, this.cv.cell_size / 2);
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
}

const cv = new Canvas('canvas');
const field = new Field(cv);

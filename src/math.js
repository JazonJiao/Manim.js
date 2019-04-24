// 2019-01-05
// make this a standalone function since it'o needed by both Grid and Arrow in animating projection
// M is an array with 6 entries, representing two column vectors
function calcProjectionMatrix(M) {
    // make a copy of this array since it will be changed (normalized)
    let U = M.copyWithin();

    // It would be much easier to calculate UU^T since it doesn't involve inverting,
    // So we first turn the given 3x2 matrix into an orthonormal basis.
    let len1 = Math.sqrt(U[0] * U[0] + U[1] * U[1] + U[2] * U[2]);
    U[0] /= len1;
    U[1] /= len1;
    U[2] /= len1;

    // apply Gram-Schmidt algorithm to make two vectors orthogonal
    // I originally forgot this step, resulting in
    // the projection being on the right plane but distorted
    let u1_dot_x = U[3] * U[0] + U[4] * U[1] + U[5] * U[2];
    U[3] -= U[0] * u1_dot_x;
    U[4] -= U[1] * u1_dot_x;
    U[5] -= U[2] * u1_dot_x;
    let len2 = Math.sqrt(U[3] * U[3] + U[4] * U[4] + U[5] * U[5]);
    U[3] /= len2;
    U[4] /= len2;
    U[5] /= len2;

    // calculate the 3x3 projection matrix
    let P = new Array(9);
    P[0] =        U[0] * U[0] + U[3] * U[3];
    P[1] = P[3] = U[0] * U[1] + U[3] * U[4];
    P[2] = P[6] = U[0] * U[2] + U[3] * U[5];
    P[4] =        U[1] * U[1] + U[4] * U[4];
    P[5] = P[7] = U[1] * U[2] + U[4] * U[5];
    P[8] =        U[2] * U[2] + U[5] * U[5];
    return P;
}

// todo: define a Matrix class

/*** 2019-01-13 // fixme: this is not correct...
 * Performs a QR factorization on an m x 3 matrix
 * Warning: each array in the 2D array represent one COLUMN of a matrix
 *
 * Example: qr3.solve([[2,3,4,5]]);
 *
 * ---- arguments ----
 * X: a 2D array
 */
class QR_3 {
    constructor(X) { // x is a three-dimensional matrix
        //let X = Y.copyWithin();
        this.Q = [];
        // for (let i = 0; i < 3; i++) {
        //     this.Q[i] = new Array(X[0].length);
        // }
        let r11 = Math.sqrt(dot_product(X[0], X[0]));
        console.log(r11);
        this.Q[0] = vector_multiply(X[0], (1 / r11));


        let r12 = dot_product(this.Q[0], X[1]);
        let p2 = vector_subtract(X[1], vector_multiply(this.Q[0], r12));
        let r22 = Math.sqrt(dot_product(p2, p2));
        this.Q[1] = vector_multiply(p2, 1 / r22);

        console.log(this.Q);

        let r13 = dot_product(this.Q[0], X[2]);
        let r23 = dot_product(this.Q[1], X[2]);

        let p3 = vector_subtract(
            vector_subtract(X[2], vector_multiply(this.Q[0], r13)),
            vector_multiply(this.Q[1], r23));
        console.log(r13, r23, p3);
        let r33 = Math.sqrt(dot_product(p3, p3));
        this.Q[2] = vector_multiply(p3, 1 / r33);

        //this.R = [r11, r12, r13, 0, r22, r23, 0, 0, r33];

        this.R_inv = [
            [1 / r11, 0, 0],
            [-r12 / r11 / r22, 1 / r22, 0],
            [(r12 * r23 - r13 * r22) / r11 / r22 / r33, -r23 / r22 / r33, 1 / r33]];
    }


    solve(y) {
        return matrix_multiply(transpose(this.R_inv), matrix_multiply(transpose(this.Q), transpose(y)));
    }


}

class Matrix {
    constructor(args) {

    }
}

// no error checking on matrix sizes is performed.
// B can also be a 1D vector, in which case returns a vector
function matrix_multiply(A, B) {
    let m = A.length;
    let n = A[0].length;
    let C = [];
    let r = B[0].length;
    if (r === undefined) {
        r = 1;
    }
    for (let i = 0; i < m; i++) {
        C[i] = new Array(r);
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < r; j++) {
            let s = 0;
            for (let k = 0; k < n; k++) {
                s += A[i][k] * B[k][j];
            }
            C[i][j] = s;
        }
        console.log(C);
    }

    if (C.length === 1) {
        return C[0];
    } else {
        return C;
    }
}


function transpose(A) {
    let T = [];
    let n = A[0].length;
    // if (n === undefined)
    //     n = 1;
    for (let i = 0; i < n; i++) {
        T[i] = new Array(A.length);
        for (let j = 0; j < A.length; j++) {
            T[i][j] = A[j][i];
        }
    }
    return T;
}

function vector_subtract(x, y) {
    let v = [];
    for (let i = 0; i < x.length; i++) {
        v[i] = x[i] - y[i];
    }
    return v;
}



function dot_product(x, y) { // x, y are arrays with the same size
    let s = 0;
    for (let i = 0; i < x.length; i++) {
        s += x[i] * y[i];
    }
    return s;
}

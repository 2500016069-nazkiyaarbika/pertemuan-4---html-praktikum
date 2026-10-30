function hitungLuas(panjang, lebar) {
    return panjang * lebar;
}
let luas1 = hitungLuas(5, 8);
let luas2 = hitungLuas(10, 3);

console.log("Luas persegi panjang dengan panjang 5 dan lebar 8 adalah: " + luas1);
console.log("Luas persegi panjang dengan panjang 10 dan lebar 3 adalah: " + luas2);

// Menampilkan hasil ke halaman HTML
document.getElementById("hasil").innerHTML = `
<p>Luas persegi panjang dengan panjang 5 dan lebar 8 adalah: ${luas1}</p>
<p>Luas persegi panjang dengan panjang 10 dan lebar 3 adalah: ${luas2}</p>
`;

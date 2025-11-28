        //  Ini buat jalanin logika kode javascript setelah halaman html selesai dimuat. 
        document.addEventListener('DOMContentLoaded', function() {
            
            //  Ini buat ngambil elemen HTML untuk dipakai dalam logika kalkulator. 
            const display = document.getElementById('display');
            const statusImage = document.getElementById('statusImage');
            const buttons = document.querySelectorAll('.btn-calc');

            //  Ini buat menyimpan URL gambar status kalkulator. 
            const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
            const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
            const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

            /**
              Ini buat mengubah gambar sesuai kondisi: normal, sukses, atau error. 
             */
            function changeImage(state) {
                if (state === 'success') {
                    statusImage.src = imgSuccess;
                    statusImage.alt = "Perhitungan Sukses";
                } else if (state === 'error') {
                    statusImage.src = imgError;
                    statusImage.alt = "Error Perhitungan";
                } else {
                    //  Jelaskan Kodingan ini apa 
                    statusImage.src = imgNormal;
                    statusImage.alt = "Status Kalkulator";
                }
            }

            /**
              Buat menghapus layar kalkulator dan balik gambar ke normal.
             */
            function clearDisplay() {
                display.value = '';
                changeImage('normal'); // Memanggil function untuk merubah gambar.
            }

            /**
              Ini buat menghapus satu karakter terakhir dari display. 
             */
            function deleteLastChar() {
                display.value = display.value.slice(0, -1);
            }

            /**
              Ini buat nambahin angka/karakter ke display. 
             */
            function appendToDisplay(value) {
                display.value += value;
            }

            /**
              Ini buat menghitung matematika. 
             */
            function calculateResult() {
                //  Mencegah perhitungan pada layar yang kosong.
                if (display.value === '') {
                    changeImage('error');
                    display.value = 'Kosong!';
                    //  Ini buat menunda pemanggilan fungsi clearDisplay selama 1,5 detik setelah pesan error ditampilkan. 
                    setTimeout(clearDisplay, 1500);
                    return;
                }

                try {
                    //  Ini untuk mengevaluasi string ekspresi matematika di layar. 
                    let result = eval(display.value
                        .replace(/%/g, '/100') //  Ini mengganti semua simbol persen (%) dalam ekspresi matematika dengan operator pembagian 100 (/100). 
                    ); 
                    
                    //  Ini memvalidasi hasil perhitungan. 
                    if (isFinite(result)) {
                        display.value = result;
                        changeImage('success'); //  Mengubah gambar status kalkulator menjadi tampilan 'success'.
                    } else {
                        throw new Error("Hasil tidak valid");
                    }

                } catch (error) {
                    console.error("Error kalkulasi:", error);
                    display.value = 'Error';
                    changeImage('error'); //  Ini mengubah gambar status kalkulator menjadi tampilan 'Error!'.
                    setTimeout(clearDisplay, 1500);
                }
            }


            //  Ini menambahkan event listener ke setiap tombol kalkulator untuk mendeteksi saat tombol diklik. 
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.getAttribute('data-value');

                    //  Ini digunakan untuk menjalankan fungsi tertentu dari nilai tombol yang diklik. 
                    switch(value) {
                        case 'C':
                            //  Ini menangani tombol 'C' dengan memanggil fungsi clearDisplay() untuk mengosongkan layar. 
                            clearDisplay();
                            break;
                        case 'DEL':
                            //  Ini menangani tombol 'DEL' dengan memanggil fungsi deleteLastChar() untuk menghapus satu karakter. 
                            deleteLastChar();
                            break;
                        case '=':
                            //  Ini menangani tombol '=' dengan memanggil fungsi calculateResult() untuk mengeksekusi perhitungan. 
                            calculateResult();
                            break;
                        default:
                            //  ini menangani tombol lainnya dan mengosongkan layar jika statusnya Sukses/Error sebelum menambahkan input baru. 
                            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                                clearDisplay();
                            }
                            appendToDisplay(value);
                            break;
                    }
                });
            });

            //  Ini biar pengguna bisa mengoperasikan kalkulator menggunakan tombol fisik keyboard. 
            document.addEventListener('keydown', (e) => {
                const key = e.key;

                if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(key);
                    e.preventDefault();
                } else if (key === 'Enter' || key === '=') {
                    calculateResult();
                    e.preventDefault();
                } else if (key === 'Backspace') {
                    deleteLastChar();
                    e.preventDefault();
                } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                    clearDisplay();
                    e.preventDefault();
                }
            });

        });
document.addEventListener('DOMContentLoaded', function() {
    
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn-calc');
    // Kita ambil elemen body kalkulator & indikator teks
    const calcBody = document.getElementById('calculator-body');
    const statusIndicator = document.getElementById('statusIndicator');

    // Fungsi update tampilan status (Modern: Ganti Class CSS)
    function updateStatus(state) {
        // Reset semua class glow dulu
        calcBody.classList.remove('status-glow-normal', 'status-glow-success', 'status-glow-error');
        
        if (state === 'success') {
            calcBody.classList.add('status-glow-success');
            statusIndicator.innerHTML = '<span class="w-2 h-2 rounded-full bg-green-400"></span> Sukses';
            statusIndicator.className = "flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-xs font-medium text-green-400 transition-all";
        } else if (state === 'error') {
            calcBody.classList.add('status-glow-error');
            statusIndicator.innerHTML = '<span class="w-2 h-2 rounded-full bg-red-400"></span> Error';
            statusIndicator.className = "flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-xs font-medium text-red-400 transition-all";
        } else {
            calcBody.classList.add('status-glow-normal');
            statusIndicator.innerHTML = '<span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> Ready';
            statusIndicator.className = "flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-xs font-medium text-blue-400 transition-all";
        }
    }

    function clearDisplay() {
        display.value = '';
        updateStatus('normal');
    }

    function deleteLastChar() {
        display.value = display.value.slice(0, -1);
    }

    function appendToDisplay(value) {
        display.value += value;
    }

    function calculateResult() {
        if (display.value === '') {
            updateStatus('error');
            display.value = 'Kosong!';
            setTimeout(clearDisplay, 1000);
            return;
        }

        try {
            // Evaluasi matematika
            let result = eval(display.value.replace(/%/g, '/100')); 
            
            if (isFinite(result)) {
                display.value = result;
                updateStatus('success');
            } else {
                throw new Error("Invalid");
            }

        } catch (error) {
            display.value = 'Error';
            updateStatus('error');
            setTimeout(clearDisplay, 1000);
        }
    }

    // Event Listeners Tombol
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            
            // Efek getar halus saat klik (Haptic feedback visual)
            button.classList.add('scale-95');
            setTimeout(() => button.classList.remove('scale-95'), 100);

            switch(value) {
                case 'C': clearDisplay(); break;
                case 'DEL': deleteLastChar(); break;
                case '=': calculateResult(); break;
                default:
                    // Kalau ada tulisan Error/Sukses, hapus dulu baru ketik angka baru
                    if (['Error', 'Kosong!'].includes(display.value)) {
                        clearDisplay();
                        appendToDisplay(value);
                    } else {
                        appendToDisplay(value);
                    }
                    break;
            }
        });
    });

    // Keyboard support tetap sama
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if ((key >= '0' && key <= '9') || ['.','+','-','*','/','%'].includes(key)) {
            if (['Error', 'Kosong!'].includes(display.value)) clearDisplay();
            appendToDisplay(key);
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
        } else if (key === 'Backspace') {
            deleteLastChar();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearDisplay();
        }
    });
});

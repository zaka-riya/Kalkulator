document.addEventListener('DOMContentLoaded', function() {
    
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn-calc');
    const calculatorBody = document.getElementById('calculator-body');
    
    // Elemen status (Safety check agar tidak error jika HTML belum update)
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');

    // --- FUNGSI FORMAT KOMA (BARU) ---
    // Fungsi ini mengubah "1000" menjadi "1,000" tapi membiarkan operator (+-*/) tetap aman
    function formatExpression(expression) {
        // Regex ini mencari angka (termasuk desimal) dalam string
        return expression.replace(/\d+(?:\.\d*)?/g, (match) => {
            let parts = match.split('.');
            // Format bagian angka bulat (ribuan) dengan koma
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join('.');
        });
    }

    // Fungsi untuk membersihkan koma sebelum dihitung matematika
    function unformatExpression(expression) {
        return expression.replace(/,/g, '');
    }

    // --- FITUR AUTO RESIZE FONT ---
    function adjustFontSize() {
        if (!display) return;
        const length = display.value.length;
        display.classList.remove('text-7xl', 'text-6xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl');

        if (length > 15) display.classList.add('text-xl');
        else if (length > 11) display.classList.add('text-3xl');
        else if (length > 8) display.classList.add('text-4xl');
        else display.classList.add('text-7xl');
    }

    function updateStatus(state) {
        if (!statusText || !statusDot || !calculatorBody) return;

        calculatorBody.classList.remove('status-glow-normal', 'status-glow-success', 'status-glow-error');

        if (state === 'success') {
            statusText.innerText = "Success";
            statusText.className = "text-xs font-semibold text-green-500";
            statusDot.className = "w-2 h-2 rounded-full bg-green-500";
            calculatorBody.classList.add('status-glow-success');
        } else if (state === 'error') {
            statusText.innerText = "Error";
            statusText.className = "text-xs font-semibold text-red-500";
            statusDot.className = "w-2 h-2 rounded-full bg-red-500";
            calculatorBody.classList.add('status-glow-error');
        } else {
            statusText.innerText = "Ready";
            statusText.className = "text-xs font-semibold text-blue-500";
            statusDot.className = "w-2 h-2 rounded-full bg-blue-500 animate-pulse";
            calculatorBody.classList.add('status-glow-normal');
        }
    }

    function clearDisplay() {
        if (!display) return;
        display.value = '';
        updateStatus('normal');
        adjustFontSize();
    }

    function deleteLastChar() {
        if (!display) return;
        
        // 1. Ambil nilai asli tanpa format
        let rawValue = unformatExpression(display.value);
        // 2. Hapus karakter terakhir
        rawValue = rawValue.slice(0, -1);
        // 3. Format ulang dan tampilkan
        display.value = formatExpression(rawValue);
        
        adjustFontSize();
    }

    function appendToDisplay(value) {
        if (!display) return;
        if (display.value === '' && value === '0') return;
        
        const currentStatus = statusText ? statusText.innerText : '';
        if (currentStatus === 'Success' || currentStatus === 'Error') {
            if (!['+', '-', '*', '/', '%'].includes(value)) {
                clearDisplay();
            } else {
                updateStatus('normal');
            }
        }
        
        // --- LOGIKA UTAMA FORMATTING ---
        // 1. Ambil string saat ini, bersihkan komanya (agar jadi angka murni)
        let cleanExpression = unformatExpression(display.value);
        // 2. Tambahkan input baru
        cleanExpression += value;
        // 3. Format ulang menjadi ada komanya
        display.value = formatExpression(cleanExpression);
        
        adjustFontSize();
    }

    function calculateResult() {
        if (!display || display.value === '') return;
        
        try {
            // PENTING: Hapus semua koma sebelum dihitung JS!
            let expression = unformatExpression(display.value);
            
            expression = expression.replace(/×/g, '*').replace(/÷/g, '/');

            if (expression === '' || "+-*/%".includes(expression)) return; 

            let result = eval(expression);
            
            if (isFinite(result)) {
                // Format hasil akhir dengan koma juga
                // Menggunakan String() agar formatExpression bisa memprosesnya
                display.value = formatExpression(String(result));
                updateStatus('success');
                adjustFontSize();
            } else {
                throw new Error("Invalid");
            }

        } catch (error) {
            updateStatus('error');
            if (calculatorBody) {
                calculatorBody.classList.add('animate-pulse');
                setTimeout(() => calculatorBody.classList.remove('animate-pulse'), 500);
            }
            setTimeout(clearDisplay, 1500);
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            handleInput(value);
        });
    });

    function handleInput(value) {
        switch(value) {
            case 'C': clearDisplay(); break;
            case 'DEL': deleteLastChar(); break;
            case '=': calculateResult(); break;
            default: appendToDisplay(value); break;
        }
    }

    // Input Keyboard
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        let btnSelector = null;

        if ((key >= '0' && key <= '9') || key === '.') {
            handleInput(key);
            btnSelector = `button[data-value="${key}"]`;
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault(); 
            handleInput('=');
            btnSelector = `button[data-value="="]`;
        } else if (key === 'Backspace') {
            handleInput('DEL');
            btnSelector = `button[data-value="DEL"]`;
        } else if (key === 'Escape') {
            handleInput('C');
            btnSelector = `button[data-value="C"]`;
        } else if (['+', '-', '*', '/', '%'].includes(key)) {
            event.preventDefault(); 
            handleInput(key);
            btnSelector = `button[data-value="${key}"]`;
        }

        if (btnSelector) {
            const btn = document.querySelector(btnSelector);
            if (btn) {
                btn.style.transform = "scale(0.9)";
                btn.style.filter = "brightness(0.9)";
                setTimeout(() => {
                    btn.style.transform = "scale(1)";
                    btn.style.filter = "none";
                }, 100);
            }
        }
    });
});
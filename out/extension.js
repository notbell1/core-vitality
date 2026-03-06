"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const SidebarProvider_1 = require("./SidebarProvider");
function activate(context) {
    // State Awal Karakter
    let health = 100;
    let energy = 100;
    let happiness = 100;
    // Tracker untuk mencegah damage berulang pada error yang sama
    let processedErrors = new Set();
    // Inisialisasi Sidebar Provider
    const sidebarProvider = new SidebarProvider_1.SidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("codingStatsView", sidebarProvider));
    /**
     * Core Engine: Mengelola logika stats, deteksi error, dan update UI
     */
    const coreEngine = () => {
        const editor = vscode.window.activeTextEditor;
        // 1. Ambil Nama Project yang sedang dibuka
        const workspaceName = vscode.workspace.name || "NO PROJECT OPEN";
        // 2. Ambil Diagnostics (Error/Warning) dari editor aktif
        const diagnostics = editor
            ? vscode.languages.getDiagnostics(editor.document.uri)
            : [];
        // Filter hanya yang tipenya "Error" (Bukan Warning/Info)
        const currentErrors = diagnostics.filter((d) => d.severity === vscode.DiagnosticSeverity.Error);
        // 3. LOGIKA DAMAGE (Event-Based: Hanya 1% per error unik)
        currentErrors.forEach((err) => {
            // Buat ID unik berdasarkan pesan error dan lokasi barisnya
            const id = `${err.message}-${err.range.start.line}`;
            if (!processedErrors.has(id)) {
                health = Math.max(0, health - 1); // Damage HP 1%
                energy = Math.max(0, energy - 2); // Damage Energy 2%
                happiness = Math.max(0, happiness - 1); // Damage Happiness 1%
                processedErrors.add(id); // Tandai error ini sudah diproses
            }
        });
        // 4. LOGIKA SLOW RECOVERY (Hanya aktif jika 0 Error)
        if (currentErrors.length === 0) {
            health = Math.min(100, health + 0.3);
            energy = Math.min(100, energy + 0.4);
            happiness = Math.min(100, happiness + 0.5);
            // Reset tracker saat bersih dari error agar bisa kena damage lagi nanti
            processedErrors.clear();
        }
        // 5. UPDATE UI (Kirim data ke SidebarProvider.ts)
        sidebarProvider.updateStats({
            health,
            energy,
            happiness,
            projectName: workspaceName.toUpperCase(),
            errors: currentErrors.map((e) => ({
                message: e.message,
                line: e.range.start.line,
                file: editor?.document.fileName.split(/[\\\/]/).pop() || "unknown",
            })),
        });
    };
    /**
     * EVENT LISTENERS
     */
    // Jalankan ticker setiap 1.5 detik untuk animasi smooth & recovery
    const ticker = setInterval(coreEngine, 1500);
    context.subscriptions.push(
    // Trigger saat mengetik
    vscode.workspace.onDidChangeTextDocument(() => coreEngine()), 
    // Trigger saat ganti file tab
    vscode.window.onDidChangeActiveTextEditor(() => coreEngine()), 
    // Bersihkan interval saat extension dimatikan
    { dispose: () => clearInterval(ticker) });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
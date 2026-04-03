const { useState, useEffect, useMemo } = React;

// ============================================
// ICONS COMPONENT (Lucide Wrapper)
// ============================================
const Icon = ({ name, size = 24, className = "" }) => {
    const iconRef = React.useRef(null);
    useEffect(() => {
        if (iconRef.current && window.lucide) {
            iconRef.current.innerHTML = '';
            const temp = document.createElement('i');
            temp.setAttribute('data-lucide', name);
            iconRef.current.appendChild(temp);
            window.lucide.createIcons({
                root: iconRef.current,
                icons: { [name]: window.lucide.icons[name] }
            });
            const svg = iconRef.current.querySelector('svg');
            if (svg) {
                svg.setAttribute('width', size);
                svg.setAttribute('height', size);
                if (className) svg.setAttribute('class', className);
            }
        }
    }, [name, size, className]);
    return <span ref={iconRef} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}></span>;
};

// ============================================
// UTILITIES & CALCULATION ENGINE
// ============================================
const calculateSubjectStats = (internalObt, internalMax, theoryObt, theoryMax) => {
    const totalObt = (parseFloat(internalObt) || 0) + (parseFloat(theoryObt) || 0);
    const totalMax = (parseFloat(internalMax) || 0) + (parseFloat(theoryMax) || 0);
    const percentage = totalMax > 0 ? (totalObt / totalMax) * 100 : 0;
    
    let gp = 0;
    if (percentage >= 90) gp = 10;
    else if (percentage >= 80) gp = 9;
    else if (percentage >= 70) gp = 8;
    else if (percentage >= 60) gp = 7;
    else if (percentage >= 55) gp = 6;
    else if (percentage >= 50) gp = 5;
    else if (percentage >= 40) gp = 4;
    else gp = 0;

    return { totalObt, totalMax, percentage, gp };
};

// ============================================
// COMPONENTS
// ============================================

// COMPONENTS
// ============================================

const SubjectCard = ({ subject, updateSubject, removeSubject, index }) => {
    const handleChange = (field, value) => {
        let val = value;
        if (val !== '') {
            if (field === 'internalObt') {
                if (Number(val) > Number(subject.internalMax)) val = subject.internalMax.toString();
                if (Number(val) < 0) val = '0';
            } else if (field === 'theoryObt') {
                if (Number(val) > Number(subject.theoryMax)) val = subject.theoryMax.toString();
                if (Number(val) < 0) val = '0';
            }
        }
        updateSubject(subject.id, { ...subject, [field]: val });
    };

    const s_stats = calculateSubjectStats(subject.internalObt, subject.internalMax, subject.theoryObt, subject.theoryMax);
    const hasInput = subject.internalObt !== '' || subject.theoryObt !== '';
    const colorIndicator = !hasInput ? 'bg-gray-200' : s_stats.percentage >= 80 ? 'bg-green-500' : s_stats.percentage >= 60 ? 'bg-blue-500' : s_stats.percentage >= 40 ? 'bg-orange-400' : 'bg-red-500';

    return (
        <div 
            className="glass-panel rounded-[24px] p-6 mb-5 relative transition-all duration-300 hover:shadow-m3-hover group shadow-m3 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-[24px] ${colorIndicator} transition-colors duration-500`}></div>
            
            <button 
                onClick={() => removeSubject(subject.id)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all opacity-80 hover:opacity-100 scale-90 hover:scale-100"
                title="Remove Subject"
                data-html2canvas-ignore
            >
                <Icon name="Trash" size={18} />
            </button>
            
            <div className="flex flex-col gap-5 pl-2 pr-6">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Subject Name</label>
                    <input 
                        type="text" 
                        value={subject.name} 
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="m3-input w-full px-4 py-3 border border-gray-200 rounded-xl outline-none font-medium text-gray-800 placeholder-gray-400 bg-gray-50"
                        placeholder={`Subject ${index + 1}`}
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
                            <Icon name="BookOpen" size={14} /> Internal
                        </label>
                        <div className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                            <input 
                                type="number" 
                                value={subject.internalObt} 
                                onChange={(e) => handleChange('internalObt', e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-center font-medium rounded-lg outline-none focus:bg-white focus:shadow-sm transition-all"
                                placeholder="Obt" 
                            />
                            <span className="text-gray-300 font-light text-xl">/</span>
                            <input 
                                type="number" 
                                value={subject.internalMax} 
                                onChange={(e) => handleChange('internalMax', e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-center font-medium rounded-lg outline-none focus:bg-white focus:shadow-sm transition-all text-gray-500"
                                placeholder="Max" 
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
                            <Icon name="FileText" size={14} /> Theory
                        </label>
                        <div className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                            <input 
                                type="number" 
                                value={subject.theoryObt} 
                                onChange={(e) => handleChange('theoryObt', e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-center font-medium rounded-lg outline-none focus:bg-white focus:shadow-sm transition-all"
                                placeholder="Obt" 
                            />
                            <span className="text-gray-300 font-light text-xl">/</span>
                            <input 
                                type="number" 
                                value={subject.theoryMax} 
                                onChange={(e) => handleChange('theoryMax', e.target.value)}
                                className="w-full px-3 py-2 bg-transparent text-center font-medium rounded-lg outline-none focus:bg-white focus:shadow-sm transition-all text-gray-500"
                                placeholder="Max" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const App = () => {
    const [semesterName, setSemesterName] = useState("");
    const [studentName, setStudentName] = useState("");
    const [rollNumber, setRollNumber] = useState("");

    const removeSubject = (id) => {
        if (subjects.length <= 1) {
            alert("At least 1 subject is compulsory!");
            return;
        }
        setSubjects(subjects.filter(s => s.id !== id));
    };

    const clearForm = () => {
        if (confirm("Are you sure you want to clear all data?")) {
            setStudentName("");
            setRollNumber("");
            setSemesterName("");
            setSubjects(Array.from({length: 5}, defaultSubject));
        }
    };

    const results = useMemo(() => {
        if (subjects.length === 0) return { sgpi: 0, percentage: 0, list: [] };
        let totalSumObt = 0;
        let totalSumMax = 0;
        let totalGp = 0;
        let validSubjectsCount = 0;
        
        const list = subjects.map(sub => {
            const hasInput = sub.internalObt !== '' || sub.theoryObt !== '';
            const s = calculateSubjectStats(sub.internalObt, sub.internalMax, sub.theoryObt, sub.theoryMax);
            
            if (hasInput) {
                totalSumObt += s.totalObt;
                totalSumMax += s.totalMax;
                totalGp += s.gp;
                validSubjectsCount += 1;
            }
            return { ...sub, ...s, hasInput };
        });

        const sgpi = validSubjectsCount > 0 ? totalGp / validSubjectsCount : 0;
        const percentage = totalSumMax > 0 ? (totalSumObt / totalSumMax) * 100 : 0;
        
        return { sgpi: sgpi.toFixed(2), percentage: percentage.toFixed(2), list };
    }, [subjects]);

    const downloadPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFillColor(21, 101, 192);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("Academic Results", 20, 25);
        
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text(`Name: ${studentName || '-'}`, 20, 50);
        doc.text(`Roll No: ${rollNumber || '-'}`, 120, 50);
        doc.text(`Semester: ${semesterName || '-'}`, 20, 60);

        doc.setFontSize(30);
        doc.setTextColor(21, 101, 192);
        doc.text(results.sgpi.toString(), 20, 80);
        doc.setFontSize(14);
        doc.setTextColor(150, 150, 150);
        doc.text("SGPI Grade", 45, 80);

        doc.setFontSize(30);
        doc.setTextColor(50, 50, 50);
        doc.text(`${results.percentage}%`, 120, 80);
        doc.setFontSize(14);
        doc.setTextColor(150, 150, 150);
        doc.text("Overall Percentage", 160, 80);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 95, 190, 95);

        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text("Subject Breakdown", 20, 110);
        
        let y = 125;
        doc.setFontSize(11);
        results.list.forEach((sub, i) => {
            const subName = sub.name || `Subject ${i+1}`;
            doc.setTextColor(30, 30, 30);
            doc.text(`${i+1}. ${subName}`, 20, y);
            doc.text(`Marks: ${sub.totalObt}/${sub.totalMax}  (${sub.percentage.toFixed(1)}%)`, 100, y);
            doc.setTextColor(21, 101, 192);
            doc.text(`GP: ${sub.gp}`, 170, y);
            y += 10;
        });

        doc.save(`${studentName || 'student'}-${semesterName || 'result'}.pdf`);
    };

    return (
        <div className="min-h-screen pb-32 relative">

            {/* Header - Glassmorphic */}
            <header className="glass-header sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Icon name="Award" size={24} />
                    </div>
                    <h1 className="text-xl font-heading font-bold text-gray-800 tracking-tight hidden sm:block">GradeCalc Pro</h1>
                </div>
                
                {/* Clear Form Button */}
                <button onClick={clearForm} className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors font-medium px-4 py-2 rounded-full">
                    <Icon name="RefreshCcw" size={18} />
                    <span className="hidden sm:inline">Clear Form</span>
                </button>
            </header>

            <main className="max-w-[720px] mx-auto p-4 sm:p-6 mt-4">
                <div className="animate-fade-in-up">
                    
                    <div className="mb-8 text-center sm:text-left">
                        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Calculate your SGPI</h2>
                        <p className="text-gray-500">Enter your internal and theory marks to dynamically calculate points.</p>
                    </div>

                    <div className="glass-panel p-6 mb-8 rounded-[24px] shadow-sm transform transition-all focus-within:shadow-md focus-within:-translate-y-1">
                        <div className="flex justify-between flex-wrap gap-4 mb-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">Student Name</label>
                                <input 
                                    type="text" 
                                    value={studentName} 
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="w-full bg-transparent text-xl font-heading font-medium text-gray-900 border-none outline-none placeholder-gray-300 transition-all border-b-2 border-transparent focus:border-primary pb-2 rounded-none"
                                    placeholder="Enter Name"
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">Roll Number</label>
                                <input 
                                    type="text" 
                                    value={rollNumber} 
                                    onChange={(e) => setRollNumber(e.target.value)}
                                    className="w-full bg-transparent text-xl font-heading font-medium text-gray-900 border-none outline-none placeholder-gray-300 transition-all border-b-2 border-transparent focus:border-primary pb-2 rounded-none"
                                    placeholder="Roll No"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">Semester Details</label>
                            <input 
                                type="text" 
                                value={semesterName} 
                                onChange={(e) => setSemesterName(e.target.value)}
                                className="w-full bg-transparent text-2xl font-heading font-bold text-gray-900 border-none outline-none placeholder-gray-300 transition-all border-b-2 border-transparent focus:border-primary pb-2 rounded-none"
                                placeholder="e.g. Semester 5"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {subjects.map((sub, i) => (
                            <SubjectCard 
                                key={sub.id} 
                                index={i}
                                subject={sub} 
                                updateSubject={(id, data) => setSubjects(subjects.map(s => s.id === id ? data : s))}
                                removeSubject={removeSubject}
                            />
                        ))}
                    </div>

                    <button 
                        onClick={() => setSubjects([...subjects, defaultSubject()])}
                        className="w-full mt-6 py-5 border-2 border-dashed border-primary/30 text-primary bg-primary/5 rounded-[24px] font-semibold hover:bg-primary/10 hover:border-primary/50 transition-all flex justify-center items-center gap-2 group"
                        data-html2canvas-ignore
                    >
                        <div className="bg-white p-1 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                            <Icon name="Plus" size={20} />
                        </div>
                        Add Subject
                    </button>

                    {/* Sticky Action / Result Banner */}
                    <div className="sticky bottom-6 mt-8 z-40 transition-all duration-500 animate-fade-in-up" style={{animationDelay: '300ms'}}>
                        <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 shadow-m3-hover border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex gap-4 sm:gap-8 w-full sm:w-auto text-center sm:text-left justify-center sm:justify-start">
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">SGPI Final</p>
                                    <p className="text-4xl font-heading font-black text-primary leading-none">{results.sgpi}</p>
                                </div>
                                <div className="w-px bg-gray-200"></div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Percentage</p>
                                    <p className="text-4xl font-heading font-black text-gray-800 leading-none">{results.percentage}<span className="text-xl text-gray-400 align-baseline">%</span></p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                <button 
                                    onClick={downloadPDF} 
                                    className="w-full sm:w-auto flex justify-center items-center gap-2 px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5"
                                    title="Export as PDF Document"
                                >
                                    <Icon name="FileDown" size={20} />
                                    <span>Download PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Developer Space */}
            <footer className="max-w-[720px] mx-auto p-4 sm:p-6 mt-2 animate-fade-in-up" style={{animationDelay: '400ms'}}>
                <div className="glass-panel p-6 sm:p-8 rounded-[32px] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <img 
                        src="profile.png" 
                        alt="Bhushan Zagade" 
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-lg object-cover border-4 border-white transform transition-transform group-hover:scale-105"
                    />
                    <div className="flex flex-col justify-center flex-1 z-10 w-full">
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Developed By</p>
                        <h3 className="text-2xl font-heading font-black text-gray-900 mb-1">Bhushan Zagade</h3>
                        <p className="text-sm font-bold text-primary tracking-wider mb-5">SYCS • VIVA College</p>
                        
                        <div className="flex flex-wrap gap-4 justify-center sm:justify-start mt-2">
                            <a href="https://github.com/bhushanz16" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors font-semibold text-sm shadow-sm">
                                <Icon name="Github" size={18} /> GitHub
                            </a>
                            <a href="https://www.linkedin.com/in/bhushan-zagade-9050b532b" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-semibold text-sm shadow-sm">
                                <Icon name="Linkedin" size={18} /> LinkedIn
                            </a>
                            <a href="https://instagram.com/bhushanz_16" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors font-semibold text-sm shadow-sm">
                                <Icon name="Instagram" size={18} /> Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

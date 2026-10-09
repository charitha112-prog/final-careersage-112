import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, BarChart3, BookOpen, Check, ChevronDown, ChevronRight,
  CircleUserRound, Clock3, Code2, Database, FileText, Home, Lightbulb,
  LogOut, Mail, Menu, MessageSquare, Phone, Play, Search, Send, Settings2,
  ShieldCheck, Sparkles, Target, Upload, User, X, Eye, EyeOff, Building2,
  ClipboardList, BrainCircuit, Mic, Trophy, Download, Share2, LockKeyhole
} from "lucide-react";
import { APP_DATA } from "./data";
import "./styles.css";

const COLORS = { navy:"#1A3263", blue:"#547792", cream:"#EFD2B0", yellow:"#FFC570" };
const currentAccount = () => { try { return JSON.parse(localStorage.getItem("cs-user") || "null"); } catch { return null; } };
const currentName = () => currentAccount()?.username || APP_DATA.user.name;

function Logo({ compact=false }) {
  return <div className={`brand ${compact ? "compact" : ""}`}>
    <div className="leaf-logo" aria-hidden="true"><span/><span/><span/></div>
    {!compact && <span>CareerSage</span>}
  </div>
}

function Glass({children, className="", ...props}) { return <section className={`glass ${className}`} {...props}>{children}</section> }

function ProgressRing({value, label="/ 100", size=118}) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return <div className="ring" style={{"--p":`${safe}%`, width:size, height:size}}>
    <div className="ring-inner"><strong>{value == null ? "—" : value}%</strong><span>{label}</span></div>
  </div>
}

function Sidebar({page, setPage}) {
  const items = [
    ["home","Home",Home], ["preparation","Preparation",Target],
    ["interview","Interview",MessageSquare], ["progress","Progress",BarChart3]
  ];
  return <aside className="sidebar">
    <Logo />
    <nav>
      {items.map(([id,label,Icon]) => <button key={id} className={page===id ? "active":""} onClick={()=>setPage(id)}>
        <Icon size={21}/><span>{label}</span>
      </button>)}
    </nav>
    <div className="side-bottom">
      <button onClick={()=>setPage("profile")}><User size={20}/>Profile</button>
      <button onClick={()=>{localStorage.removeItem("cs-user");setPage("landing")}}><LogOut size={20}/>Logout</button>
    </div>
  </aside>
}

function UserPill({setPage}) {
  const account=currentAccount();
  return <div className="workspace-actions">
    <button className="resume-kitten" onClick={()=>setPage("upload")} title="Choose a new resume">
      <span className="kitten-circle"><img src="/graduation-kitten.gif" alt="CareerSage graduation kitten" /></span>
      <span className="resume-kitten-label">New Resume</span>
    </button>
    <div className="user-pill"><CircleUserRound size={20}/><span>{account?.username||APP_DATA.user.name}</span><ChevronDown size={15}/></div>
  </div>
}

function AppShell({page,setPage,children,headerTitle,headerSubtitle,headerAction}) {
  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage}/>
    <main className="workspace">
      <div className={`workspace-top ${headerTitle ? "has-page-heading" : ""}`}>
        {headerTitle && <div className="workspace-heading"><h1>{headerTitle}</h1><p>{headerSubtitle}</p></div>}
        <div className="workspace-top-right">{headerAction}<UserPill setPage={setPage}/></div>
      </div>
      {children}
    </main>
  </div>
}

function Landing({go}) {
  return <div className="public-page landing">
    <header className="public-nav"><Logo/><div className="nav-links"><a href="#about">About</a><a href="#features">Features</a><a href="#contact">Contact</a><button onClick={go}>Get Started <ArrowRight size={17}/></button></div></header>
    <div className="landing-orb orb-a"/><div className="landing-orb orb-b"/>
    <Glass className="landing-card">
      <Logo/>
      <h1>Know where you stand.<br/>Know what to do next.</h1>
      <p>Insights, guidance and practice —<br/>all in one place.</p>
      <button className="primary big" onClick={go}>Get Started <ArrowRight/></button>
    </Glass>
  </div>
}

function Login({goCreate, onLogin, goLanding}) {
  const [identity,setIdentity]=useState(""); const [password,setPassword]=useState(""); const [show,setShow]=useState(false); const [error,setError]=useState("");
  const submit=()=>{setError(""); if(!identity.trim()||!password){setError("Enter your email or phone number and password.");return;} const accounts=JSON.parse(localStorage.getItem("cs-accounts")||"[]"); const account=accounts.find(a=>(a.email.toLowerCase()===identity.trim().toLowerCase()||a.phone===identity.trim())&&a.password===password); if(!account){setError("We couldn’t find an account with those details. Check your details or create an account.");return;} localStorage.setItem("cs-user",JSON.stringify(account)); onLogin(account);};
  return <div className="public-page login-page"><div className="login-deco deco-1"/><div className="login-deco deco-2"/><div className="login-left"><Logo/><blockquote>Careers aren’t a destination,<br/>they’re a journey.<br/>Let’s build yours together.</blockquote><div className="sticky">Think of us like a<br/>senior you can<br/>always ask. ♡</div></div><Glass className="login-card"><Logo/><h1>Welcome to CareerSage</h1><p>Let’s get to know you before we get started.</p><label className="field"><Mail size={22}/><span><b>Email or Phone Number</b><input value={identity} onChange={e=>setIdentity(e.target.value)} placeholder="Enter your email or phone number" autoComplete="username"/></span></label><label className="field"><LockKeyhole size={22}/><span><b>Password</b><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password"/></span><button className="icon-btn" type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={20}/>:<Eye size={20}/>}</button></label><div className="login-options"><label><input type="checkbox" defaultChecked/> Remember me</label><button onClick={()=>setError("For this demo, create a new account if you can’t remember your password.")}>Forgot password?</button></div>{error&&<div className="form-error" role="alert">{error}</div>}<button className="primary wide" onClick={submit}>Log In <ArrowRight/></button><div className="form-switch">Don’t have an account? <button onClick={goCreate}>Create an account</button></div><button className="back-home" onClick={goLanding}>← Back to home</button></Glass></div>
}

function CreateAccount({goLogin,onCreate}) {
 const [form,setForm]=useState({username:"",email:"",phone:"",password:"",confirm:""}); const [show,setShow]=useState(false); const [error,setError]=useState(""); const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
 const submit=()=>{setError(""); if(Object.values(form).some(v=>!v.trim()))return setError("Please complete all required fields."); if(form.password.length<6)return setError("Your password must contain at least 6 characters."); if(form.password!==form.confirm)return setError("Your passwords don’t match. Please try again."); if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))return setError("Enter a valid email address."); if(!/^[+0-9 ()-]{8,18}$/.test(form.phone))return setError("Enter a valid phone number."); const accounts=JSON.parse(localStorage.getItem("cs-accounts")||"[]"); if(accounts.some(a=>a.email.toLowerCase()===form.email.trim().toLowerCase()))return setError("This email is already registered. Please log in."); if(accounts.some(a=>a.phone===form.phone.trim()))return setError("This phone number is already registered. Please log in."); const account={username:form.username.trim(),email:form.email.trim(),phone:form.phone.trim(),password:form.password}; accounts.push(account); localStorage.setItem("cs-accounts",JSON.stringify(accounts)); localStorage.setItem("cs-user",JSON.stringify(account)); onCreate(account); };
 return <div className="public-page login-page"><div className="login-deco deco-1"/><div className="login-deco deco-2"/><div className="login-left"><Logo/><blockquote>Careers aren’t a destination,<br/>they’re a journey.<br/>Let’s build yours together.</blockquote><div className="sticky">Think of us like a<br/>senior you can<br/>always ask. ♡</div></div><Glass className="login-card create-card"><Logo/><h1>Create your account</h1><p>Let’s get to know you and start your journey.</p>{[["username","Username",User,"Enter your username"],["email","Email Address",Mail,"Enter your email address"],["phone","Phone Number",Phone,"Enter your phone number"]].map(([k,l,I,ph])=><label className="field" key={k}><I size={21}/><span><b>{l}</b><input value={form[k]} onChange={e=>upd(k,e.target.value)} placeholder={ph}/></span></label>)}{[["password","Password","Create a password (at least 6 characters)"],["confirm","Confirm Password","Re-enter your password"]].map(([k,l,ph])=><label className="field" key={k}><LockKeyhole size={21}/><span><b>{l}</b><input type={show?"text":"password"} value={form[k]} onChange={e=>upd(k,e.target.value)} placeholder={ph}/></span><button className="icon-btn" type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={19}/>:<Eye size={19}/>}</button></label>)}{error&&<div className="form-error" role="alert">{error}</div>}<button className="primary wide" onClick={submit}>Create Account <ArrowRight/></button><div className="form-switch">Already have an account? <button onClick={goLogin}>Log In</button></div></Glass></div>
}

function ResumeUpload({setPage}) {
 const [file,setFile]=useState(null); const [dragging,setDragging]=useState(false); const [shot,setShot]=useState(false); const [error,setError]=useState(""); const inputRef=useRef(); const timerRef=useRef(null);
 useEffect(()=>()=>clearTimeout(timerRef.current),[]);
 const select=f=>{if(!f)return;setError("");if(!/\.(pdf|doc|docx)$/i.test(f.name)){setError("Please choose a PDF, DOC, or DOCX file.");return;}if(f.size>10*1024*1024){setError("Your file must be 10 MB or smaller.");return;}setFile(f);setShot(false);};
 const dropFile=e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files?.[0];if(f)select(f);};
 const launch=()=>{if(shot)return;setShot(true);try{localStorage.setItem(`cs-resume-name:${currentAccount()?.email||"demo"}`,file.name)}catch{};timerRef.current=setTimeout(()=>setPage("analyzing"),2300);};
 return <AppShell page="home" setPage={setPage}>
   <PageTitle title={`Good to see you, ${currentName().split(" ")[0]} 👋`} subtitle="Let’s get started with your resume."/>
   <Glass className={`upload-card ${file?"basket-state":""}`}>
     <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={e=>select(e.target.files?.[0])} hidden/>
     {!file ? <>
       <div className="upload-kitten-preview" aria-label="CareerSage kitten animation">
         <img src="/graduation-kitten.gif" alt="Graduation kitten holding a resume" />
       </div>
       <FileText className="upload-file-mark" size={36} strokeWidth={1.6}/><h2>Upload your resume</h2><p>Drop your file here or click to browse</p>
       <div className={`dropzone ${dragging?"dragging":""}`} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={dropFile} onClick={()=>inputRef.current?.click()}><button className="primary" type="button">Browse Files</button><span>PDF • DOC • DOCX (Max 10MB)</span></div>
       <button className="sample-link" onClick={()=>select(new File(["CareerSage sample resume content"],"Sample_Resume.pdf",{type:"application/pdf"}))}><Lightbulb size={17}/> Not sure? Try a sample resume <ArrowRight size={17}/></button>
     </> : <>
       <div className={`basket-scene ${shot?"shot-active":""}`}>
         <div className="hoop-backboard"><div className="backboard-square"/></div>
         <div className="hoop-net" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
         <div className="hoop-rim" aria-hidden="true"/>
         <div className="basket-target" onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move";e.currentTarget.classList.add("target-hover")}} onDragLeave={e=>e.currentTarget.classList.remove("target-hover")} onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove("target-hover");launch()}} title="Drop the resume into the basket" aria-label="Basket target"/>
         <div className={`pdf-token ${shot?"pdf-shot":""}`} draggable={!shot} onDragStart={e=>{e.dataTransfer.setData("text/plain",file.name);e.dataTransfer.effectAllowed="move"}} onClick={()=>{if(!shot)setError("Drag the resume into the basket to make the shot.")}} title="Drag this resume into the basket"><FileText size={29}/><small>{/\.pdf$/i.test(file.name)?"PDF":"FILE"}</small></div>
       </div>
       <h2>{shot?"Good shot! 🏀":"Ready for the shot?"}</h2>
       <p>{shot?"Nice shot! Your resume is heading to analysis.":"Drag your resume into the basketball hoop."}</p>
       <div className="selected-file"><FileText size={17}/><span title={file.name}>{file.name}</span><button disabled={shot} onClick={()=>{setFile(null);setShot(false);setError("")}}>Change file</button></div>
     </>}
     {error&&<div className="form-error" role="alert">{error}</div>}
   </Glass>
 </AppShell>
}

function PageTitle({title,subtitle,action}) {
  return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>
}

function Analyzing({setPage}) {
  const [progress,setProgress]=useState(0);
  const steps=["Reading your resume...","Understanding your experience...","Analyzing your skills...","Finding areas you can strengthen...","Preparing your personalized career dashboard..."];
  useEffect(()=>{const t=setInterval(()=>setProgress(p=>{if(p>=100){clearInterval(t);setTimeout(()=>setPage("done"),500);return 100}return p+2}),65);return()=>clearInterval(t)},[]);
  const active=Math.min(4,Math.floor(progress/21));
  return <AppShell page="resume" setPage={setPage}>
    <PageTitle title="Analyzing your resume..." subtitle="I’m going through your resume and preparing your personalized insights."/>
    <Glass className="analysis-card">
      <div className="steps">{steps.map((s,i)=><div className={i<active?"done":i===active?"current":""} key={s}><span>{i<active?<Check size={16}/>:i+1}</span><label>{s}</label></div>)}</div>
      <ProgressRing value={progress} label=""/>
    </Glass>
    <div className="time-note"><Clock3 size={20}/> This won’t take long. Good things take a little time! <Sparkles size={18}/></div>
  </AppShell>
}

function Done({setPage}) {
  return <AppShell page="resume" setPage={setPage}>
    <div className="done-wrap"><Glass className="done-card"><div className="done-check"><Check size={55}/></div><h1>Your resume is analyzed!</h1><p>I’ve gone through your resume and prepared your personalized career dashboard.</p><button className="primary big" onClick={()=>setPage("home")}>View My Dashboard <ArrowRight/></button></Glass></div>
  </AppShell>
}

function Dashboard({setPage}) {
  const d=APP_DATA.dashboard; const [expanded,setExpanded]=useState(""); const [statDetail,setStatDetail]=useState("");
  const labels={skills:"Your Skill Analysis",roles:"Top Role Matches",activity:"Recent Activity",strengths:"Strengths",improve:"Areas to Improve",steps:"Next Steps"};
  return <AppShell page="home" setPage={setPage} headerTitle={`Welcome back, ${currentName().split(" ")[0]}! 👋`} headerSubtitle="Here’s your personalized career overview." headerAction={<div className="sticky-note"><Lightbulb/><span>Small steps today, bigger opportunities tomorrow.</span></div>}>
    <div className="dashboard-page page-fit">
      <div className="stat-grid dashboard-stats">
        <Glass><h3><FileText/> Resume Score</h3><div className="stat-with-note"><ProgressRing value={APP_DATA.resume.score} size={88}/><span>A strong foundation!<br/>Keep building further.</span></div></Glass>
        <Glass className="clickable-stat" role="button" tabIndex={0} onClick={()=>setStatDetail("skills")}><h3><BarChart3/> Skills Identified</h3><div className="stat-number-with-icon"><div><strong className="big-number">6</strong><span>key skills · view list</span></div></div></Glass>
        <Glass className="clickable-stat" role="button" tabIndex={0} onClick={()=>setStatDetail("roles")}><h3><Target/> Recommended Roles</h3><div className="stat-number-with-icon"><div><strong className="big-number">{d.recommendedRoles}</strong><span>roles · view list</span></div></div></Glass>
        <Glass><h3><BookOpen/> Preparation Status</h3><div className="stat-with-note"><ProgressRing value={d.preparationStatus} size={88}/><span>You’re on the right track!<br/>Keep practicing.</span></div></Glass>
      </div>
      <div className="home-row home-row-main">
        <Glass><CardHead icon={<BarChart3/>} title="Your Skill Analysis" link="View More" onClick={()=>setExpanded("skills")}/>{d.skillAnalysis.slice(0,5).map(([n,v])=><Bar key={n} label={n} value={v}/>)}</Glass>
        <Glass><CardHead icon={<Target/>} title="Top Role Matches" link="View All" onClick={()=>setExpanded("roles")}/>{d.roleMatches.slice(0,3).map(([n,v],i)=><div className="role-row" key={n}><b>{i+1}</b><span>{n}<i className="role-meter"><i style={{width:`${v}%`}}/></i></span><strong>{v}%</strong></div>)}</Glass>
        <Glass><CardHead icon={<Clock3/>} title="Recent Activity" link="View All" onClick={()=>setExpanded("activity")}/>{APP_DATA.preparation.recentActivity.slice(0,3).map((x,i)=><div className="activity-row" key={x[0]}><span className={`activity-icon activity-${i}`}><Check size={16}/></span><span>{i===0?"Completed 20 DSA questions":i===1?"Attempted company-wise test (TCS)":"Practiced behavioral questions"}</span><small>{x[4]||["2h ago","5h ago","1d ago"][i]}</small></div>)}</Glass>
      </div>
      <div className="home-row home-row-bottom">
        <Glass><CardHead icon={<Sparkles/>} title="Strengths" link="View More" onClick={()=>setExpanded("strengths")}/>{d.strengths.slice(0,3).map((x,i)=><div className="detail-list-row" key={x}><span className="list-symbol">{["✦","▦","↗"][i]}</span><div><b>{x}</b><small>{["Strong understanding of core concepts","Hands-on project development","Consistently eager to learn new skills"][i]}</small></div></div>)}</Glass>
        <Glass><CardHead icon={<BarChart3/>} title="Areas to Improve" link="View More" onClick={()=>setExpanded("improve")}/>{d.areasToImprove.slice(0,3).map((x,i)=><div className="detail-list-row" key={x}><span className="list-symbol">{["◈","☁","◷"][i]}</span><div><b>{x}</b><small>{["Practice system architecture","Explore cloud platforms and deployment","Work on answering within time limits"][i]}</small></div></div>)}</Glass>
        <Glass><CardHead icon={<Check/>} title="Next Steps" link="View More" onClick={()=>setExpanded("steps")}/>{d.nextSteps.slice(0,3).map((x,i)=><div className="detail-list-row" key={x}><span className="step-number">{i+1}</span><div><b>{x}</b></div></div>)}</Glass>
      </div>
    </div>
    {statDetail&&<DetailModal title={statDetail==="skills"?"Skills Identified":"Recommended Roles"} onClose={()=>setStatDetail("")}><div className="expanded-list">{statDetail==="skills"? ["Python","C / C++","Data Structures & Algorithms","Machine Learning","SQL","Problem Solving"].map(x=><div className="detail-list-row" key={x}><span className="list-symbol">✓</span><div><b>{x}</b><small>Identified in the demo resume profile</small></div></div>):d.roleMatches.map(([n,v],i)=><div className="role-row" key={n}><b>{i+1}</b><span>{n}<i className="role-meter"><i style={{width:`${v}%`}}/></i></span><strong>{v}%</strong></div>)}</div></DetailModal>}
    {expanded&&<DetailModal title={labels[expanded]} onClose={()=>setExpanded("")}><div className="expanded-list">
      {expanded==="skills"&&d.skillAnalysis.map(([n,v])=><Bar key={n} label={n} value={v}/>)}
      {expanded==="roles"&&d.roleMatches.concat([["AI/ML Engineer",71],["Data Engineer",69],["QA Automation Engineer",65]]).map(([n,v],i)=><div className="role-row" key={n}><b>{i+1}</b><span>{n}<i className="role-meter"><i style={{width:`${v}%`}}/></i></span><strong>{v}%</strong></div>)}
      {expanded==="activity"&&APP_DATA.preparation.recentActivity.map((x,i)=><div className="activity-row" key={x[0]}><span className={`activity-icon activity-${i%3}`}><Check size={16}/></span><span>{["Completed DSA practice","Attempted company-wise test","Practiced technical concepts","Reviewed mock test results"][i]}</span><small>{x[4]}</small></div>)}
      {expanded==="strengths"&&d.strengths.concat(["Problem-solving approach","Adaptability","Collaboration"]).map(x=><div className="detail-list-row" key={x}><span className="list-symbol">✦</span><div><b>{x}</b><small>Identified from your current practice profile</small></div></div>)}
      {expanded==="improve"&&d.areasToImprove.concat(["Communication clarity","Time management","Cloud deployment"]).map(x=><div className="detail-list-row" key={x}><span className="list-symbol">◈</span><div><b>{x}</b><small>Suggested focus area for your next practice sessions</small></div></div>)}
      {expanded==="steps"&&d.nextSteps.concat(["Review your weakest technical topic","Track your weekly accuracy"]).map((x,i)=><div className="detail-list-row" key={x}><span className="step-number">{i+1}</span><div><b>{x}</b></div></div>)}
    </div></DetailModal>}
  </AppShell>
}


function CardHead({icon,title,link,onClick}) { return <div className="card-head"><h2>{icon}{title}</h2>{link&&<button onClick={onClick}>{link} <ArrowRight size={16}/></button>}</div> }
function DetailModal({title,children,onClose}) {
  useEffect(()=>{const onKey=e=>{if(e.key==="Escape")onClose()};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="glass detail-modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-head"><h2>{title}</h2><button className="modal-close" onClick={onClose} aria-label="Close"><X/></button></div>{children}</section></div>
}
function Bar({label,value}) { return <div className="bar-row"><span>{label}</span><div><i style={{width:`${value}%`}}/></div><b>{value}%</b></div> }
function Pills({items}) { return <div className="pills">{items.map(x=><span key={x}>{x}</span>)}</div> }

function ResumeAnalysis({setPage}) {
  const r=APP_DATA.resume;
  const downloadReport=()=>{const report=["CareerSage Resume Analysis",`Overall Resume Score: ${r.score}/100`,"", "Quick Insights:",...r.insights.map((x,i)=>`${i+1}. ${x}`),"","Suggestions:",...r.suggestions.map((x,i)=>`${i+1}. ${x}`)].join("\n");const url=URL.createObjectURL(new Blob([report],{type:"text/plain"}));const a=document.createElement("a");a.href=url;a.download="CareerSage-Resume-Report.txt";a.click();URL.revokeObjectURL(url);};
  const shareReport=async()=>{try{if(navigator.share)await navigator.share({title:"CareerSage Resume Analysis",text:`My demo resume score is ${r.score}/100.`,url:window.location.href});else if(navigator.clipboard){await navigator.clipboard.writeText(window.location.href);alert("CareerSage page link copied.");}else alert("You can share this page using the browser address bar.");}catch{}}
  return <AppShell page="resume" setPage={setPage}>
    <PageTitle title="Resume Analysis" subtitle="Here’s a detailed breakdown of your resume." action={<div className="actions"><button className="secondary" onClick={downloadReport}><Download/> Download Report</button><button className="secondary" onClick={shareReport}><Share2/> Share</button></div>}/>
    <div className="analysis-grid resume-analysis-grid">
      <Glass><CardHead icon={<FileText/>} title="Overall Resume Score"/><div className="score-panel"><ProgressRing value={r.score}/><div>{[["Content Quality",r.contentQuality],["Skill Relevance",r.skillRelevance],["Role Alignment",r.roleAlignment],["Clarity & Structure",r.clarity]].map(([n,v])=><Bar key={n} label={n} value={v}/>)}</div></div></Glass>
      <Glass><CardHead icon={<Lightbulb/>} title="Quick Insights"/>{r.insights.map((x,i)=><div className="insight" key={x}><span>{i+1}</span><p>{x}</p></div>)}</Glass>
      <Glass className="span-2"><CardHead icon={<BarChart3/>} title="Skills Analysis"/><div className="skill-cols"><SkillGroup title="Technical Skills" items={r.technicalSkills}/><SkillGroup title="Soft Skills" items={r.softSkills}/><SkillGroup title="Other Skills" items={r.otherSkills}/></div></Glass>
      <Glass><CardHead icon={<Search/>} title="Keyword Match"/><Metric label="Matched Keywords" value={r.matchedKeywords}/><Metric label="Missing Keywords" value={r.missingKeywords}/><Metric label="Suggested Keywords" value={r.suggestedKeywords}/></Glass>
      <Glass><CardHead icon={<Target/>} title="Role Alignment"/>{r.roleAlignment.map(x=><div className="role-detail" key={x.role}><b>{x.role}</b><strong>{x.score}%</strong><span>{x.skills}</span></div>)}</Glass>
      <Glass><CardHead icon={<Sparkles/>} title="Suggestions to Improve"/>{r.suggestions.map((x,i)=><div className="suggestion" key={x}><b>{i+1}</b><span>{x}</span></div>)}</Glass>
    </div>
  </AppShell>
}

function SkillGroup({title,items}) {return <div><h4>{title}</h4><div className="skill-tags">{items.map(x=><span key={x}>{x}</span>)}</div></div>}
function Metric({label,value}) {return <div className="metric"><span>{label}</span><div className="metric-tags">{value.map(x=><em key={x}>{x}</em>)}</div></div>}

function Preparation({setPage}) {
  const [tab,setTab]=useState("overview"); const p=APP_DATA.preparation;
  if(tab==="activity") return <ActivityPage items={p.recentActivity} setTab={setTab} setPage={setPage}/>;
  if(tab==="technical") return <QuestionBank title="Technical Questions" subtitle="Practice the core concepts that matter in technical rounds." items={p.categories} icon={<Code2/>} setTab={setTab} setPage={setPage}/>;
  if(tab==="topic") return <QuestionBank title="Function-wise Questions" subtitle="Choose a function area and start focused practice." items={[{name:"Software Development",count:200},{name:"Data Science & Analytics",count:150},{name:"Cloud & DevOps",count:120},{name:"Product & Project Management",count:100}]} icon={<BrainCircuit/>} setTab={setTab} setPage={setPage}/>;
  if(tab==="company") return <QuestionBank title="Company-wise Questions" subtitle="Practice questions organized around company interview patterns." items={p.companies} icon={<Building2/>} setTab={setTab} setPage={setPage} company/>;
  if(tab==="mock") return <MockTests tests={p.mockTests} setTab={setTab} setPage={setPage}/>;
  return <AppShell page="preparation" setPage={setPage} headerTitle="Interview Preparation" headerSubtitle="Practice, improve and get interview ready with personalized questions." headerAction={<div className="sticky-note"><Lightbulb/><span>Focused practice today, confidence tomorrow.</span></div>}>
    <div className="prep-overview page-fit">
      <div className="prep-top-row">
        <Glass><CardHead icon={<BarChart3/>} title="Interview Readiness"/><div className="score-panel prep-readiness"><ProgressRing value={p.readiness} size={88}/><div>{[["Technical Knowledge",p.technicalKnowledge],["Problem Solving",p.problemSolving],["Communication",p.communication],["System Design",p.systemDesign]].map(([n,v])=><Bar key={n} label={n} value={v}/>)}</div></div></Glass>
        <Glass><CardHead icon={<ClipboardList/>} title="Upcoming Practice Sections"/>{p.mockTests.map((x,i)=><button className="prep-plan-item" key={x.name} onClick={()=>setTab("mock")}><span className="prep-item-icon">{i===0?"▣":i===1?"▦":"⌘"}</span><span><b>{x.name}</b><small>{x.meta}</small></span><ChevronRight/></button>)}</Glass>
        <Glass><CardHead icon={<Clock3/>} title="Recent Practice Activity" link="View All" onClick={()=>setTab("activity")}/>{p.recentActivity.slice(0,3).map((x,i)=><div className="activity-row" key={x[0]}><span className={`activity-icon activity-${i}`}><Check size={16}/></span><span>{["Completed DSA questions","Attempted TCS questions","Practiced system design"][i]}</span><small>{["2h ago","5h ago","1d ago"][i]}</small></div>)}</Glass>
      </div>
      <div className="prep-bottom-row">
        <Glass><CardHead icon={<Code2/>} title="Technical Questions" link="View All" onClick={()=>setTab("technical")}/>{p.categories.slice(0,4).map(x=><button className="prep-list-item" key={x.name} onClick={()=>setTab("technical")}><Code2/><span><b>{x.name}</b><small>{x.count}+ questions</small></span><ChevronRight/></button>)}</Glass>
        <Glass><CardHead icon={<Building2/>} title="Company-wise Questions" link="View All" onClick={()=>setTab("company")}/>{p.companies.slice(0,4).filter((_,i)=>i%2===0||true).slice(0,4).map(x=><button className="prep-list-item" key={x.name} onClick={()=>setTab("company")}><span className="company-mark">{x.name[0]}</span><span><b>{x.name}</b><small>{x.count}+ questions</small></span><ChevronRight/></button>)}</Glass>
        <Glass><CardHead icon={<BrainCircuit/>} title="Function-wise Questions" link="View All" onClick={()=>setTab("topic")}/>{[{name:"Software Development",count:200},{name:"Data Science & Analytics",count:150},{name:"Cloud & DevOps",count:120},{name:"Product & Project Management",count:100}].slice(0,4).map(x=><button className="prep-list-item" key={x.name} onClick={()=>setTab("topic")}><BrainCircuit/><span><b>{x.name}</b><small>{x.count}+ questions</small></span><ChevronRight/></button>)}</Glass>
        <Glass><CardHead icon={<ClipboardList/>} title="Mock Tests" link="View All" onClick={()=>setTab("mock")}/>{p.mockTests.slice(0,3).map(x=><button className="prep-list-item" key={x.name} onClick={()=>setTab("mock")}><ClipboardList/><span><b>{x.name}</b><small>{x.meta}</small></span><ChevronRight/></button>)}</Glass>
      </div>
    </div>
  </AppShell>
}

function ActivityPage({items,setTab,setPage}) {
  return <AppShell page="preparation" setPage={setPage}><PageTitle title="Recent Practice Activity" subtitle="Review your latest practice sessions and scores." action={<button className="secondary" onClick={()=>setTab("overview")}><ArrowRight style={{transform:"rotate(180deg)"}}/> Back to Preparation</button>}/><Glass className="activity-page-card">{items.map((x,i)=><div className="activity-page-row" key={x[0]}><span className={`activity-icon activity-${i%3}`}><Check/></span><div><b>{x[0]}</b><small>{x[1]} difficulty · {x[2]} questions · {x[4]}</small></div><strong>{x[3]}</strong></div>)}</Glass></AppShell>
}

function QuestionBank({title,subtitle,items,icon,setTab,setPage,company=false}) {
  const [q,setQ]=useState("");
  return <AppShell page="preparation" setPage={setPage}>
    <PageTitle title={title} subtitle={subtitle} action={<button className="secondary" onClick={()=>setTab("overview")}><ArrowRight style={{transform:"rotate(180deg)"}}/> Back</button>}/>
    <Glass className="bank">
      <div className="search-row"><div className="searchbox"><Search size={19}/><input placeholder="Search questions..." value={q} onChange={e=>setQ(e.target.value)}/></div><select><option>All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
      <div className="bank-grid">{items.filter(x=>x.name.toLowerCase().includes(q.toLowerCase())).map(x=><button className="bank-card" key={x.name} onClick={()=>setPage("interview")}><div className="bank-icon">{company?<Building2/>:icon}</div><div><h3>{x.name}</h3><p>{x.count}+ questions</p></div><ArrowRight/></button>)}</div>
    </Glass>
  </AppShell>
}

function MockTests({tests,setTab,setPage}) {
  return <AppShell page="preparation" setPage={setPage}>
    <PageTitle title="Mock Tests" subtitle="Test yourself under realistic interview conditions." action={<button className="secondary" onClick={()=>setTab("overview")}><ArrowRight style={{transform:"rotate(180deg)"}}/> Back</button>}/>
    <div className="mock-grid">{tests.map((x,i)=><Glass key={x.name}><div className="mock-icon"><ClipboardList/></div><h2>{x.name}</h2><p>{x.meta}</p><button className="primary wide" onClick={()=>setPage("interview")}>Start Mock Test <Play size={18}/></button></Glass>)}</div>
  </AppShell>
}

function ProgressPage({p,setPage,back}) {
  return <AppShell page="progress" setPage={setPage} headerTitle="Your Progress" headerSubtitle="See how your preparation is improving over time." headerAction={<><div className="sticky-note"><Lightbulb/><span>Consistency today, success tomorrow.</span></div><button className="secondary back-prep" onClick={back||(()=>setPage("preparation"))}><ArrowRight style={{transform:"rotate(180deg)"}}/> Back to Preparation</button></>}>
    <div className="progress-page page-fit">
      <div className="progress-grid progress-compact-grid">
        <Glass className="progress-chart-card"><CardHead icon={<BarChart3/>} title="Progress Overview"/><BigChart data={p.progress}/></Glass>
        <Glass className="summary-card"><CardHead icon={<Trophy/>} title="Practice Summary"/><div className="summary-list"><div><span className="summary-icon">▤</span><section><b>91</b><span>Questions attempted</span></section></div><div><span className="summary-icon summary-green">◎</span><section><b>78%</b><span>Latest accuracy</span></section></div><div><span className="summary-icon summary-purple">◷</span><section><b>11 min</b><span>Avg. time / question</span></section></div></div></Glass>
      </div>
    </div>
  </AppShell>
}

function MiniChart({data}) { return <div className="mini-chart">{data.map(x=><div key={x.week}><div className="dot" style={{bottom:`${x.accuracy}%`}}/><div className="chart-line" style={{height:`${x.accuracy}%`}}/><span>{x.week.replace("Week ","W")}</span></div>)}</div> }
function BigChart({data}) {
  const max=100, w=760, h=330, left=46, top=28, bottom=40, usableH=h-top-bottom, usableW=w-left-20;
  const pts=data.map((x,i)=>({x:left+(usableW/(Math.max(1,data.length-1)))*i,y:top+usableH-(x.accuracy/max)*usableH,...x}));
  const path=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  const area=`${path} L ${pts[pts.length-1]?.x||left},${h-bottom} L ${pts[0]?.x||left},${h-bottom} Z`;
  return <div className="big-chart animated-chart"><svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Weekly preparation accuracy graph" preserveAspectRatio="none"><defs><linearGradient id="progressFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6e83ff" stopOpacity=".34"/><stop offset="100%" stopColor="#6e83ff" stopOpacity=".03"/></linearGradient><linearGradient id="progressBars" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#1f56c7"/><stop offset="100%" stopColor="#8fc5f5" stopOpacity=".38"/></linearGradient></defs>{[0,25,50,75,100].map(v=>{const y=top+usableH-(v/max)*usableH;return <g key={v}><line x1={left} x2={w-8} y1={y} y2={y} className="chart-grid-line"/><text x="4" y={y+5} className="chart-axis-label">{v}</text></g>})}<path d={area} fill="url(#progressFill)" className="chart-area-fill"/><path d={path} className="chart-trend-line" pathLength="100"/>{pts.map((p,i)=><g key={p.week} className="chart-data-point" style={{animationDelay:`${i*.18}s`}}><rect x={p.x-18} y={p.y} width="36" height={h-bottom-p.y} rx="18" fill="url(#progressBars)"/><circle cx={p.x} cy={p.y} r="7"/><rect x={p.x-29} y={p.y-39} width="58" height="25" rx="12" className="chart-label-bg"/><text x={p.x} y={p.y-22} textAnchor="middle" className="chart-value-label">{p.accuracy}%</text><text x={p.x} y={h-9} textAnchor="middle" className="chart-week-label">{p.week}</text></g>)}</svg></div>
}

function Interview({setPage}) {
  const [answer,setAnswer]=useState(""); const [started,setStarted]=useState(false); const [count,setCount]=useState(0); const [showPrevious,setShowPrevious]=useState(false); const [chatExpanded,setChatExpanded]=useState(false); const [ended,setEnded]=useState(false); const [selected,setSelected]=useState(1); const [seconds,setSeconds]=useState(0);
  const questions=[APP_DATA.interview.question,"Why do you want to work at this company?","What are your key strengths?","Explain a challenging project you worked on.","How do you approach debugging a difficult issue?","Describe a time you worked with a team.","What is one technical concept you recently learned?","How would you improve a slow application?","Tell me about a mistake and what you learned.","Where do you want to grow professionally?"];
  useEffect(()=>{if(!started||ended)return;const id=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(id)},[started,ended]);
  const fmt=n=>`${String(Math.floor(n/3600)).padStart(2,"0")}:${String(Math.floor(n/60)%60).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;
  const send=()=>{if(!answer.trim()||ended)return;setCount(c=>c+1);setAnswer("");setSelected(Math.min(10,selected+1));};
  const choose=n=>{setSelected(n);};
  return <AppShell page="interview" setPage={setPage} headerTitle="Practice Interview" headerSubtitle="A realistic interview experience, tailored for you." headerAction={<div className="sticky-note"><Lightbulb/><span>Practice today, confidence tomorrow.</span></div>}>
    <div className={`interview-page page-fit ${chatExpanded?"chat-expanded":""}`}>
      <div className="interview-top-row">
        <Glass className="interview-progress-card"><CardHead icon={<BarChart3/>} title="Interview Progress"/><div className="interview-progress-inner"><ProgressRing value={Math.round(count/10*100)} size={112}/><div><p>Questions Attempted <b>{count}</b></p><p>Total Questions <b>10</b></p><p>Time Spent <b>{started?fmt(seconds):"—"}</b></p></div></div></Glass>
        <Glass className="current-session-card"><CardHead icon={<Clock3/>} title="Current Session"/><strong className="session-timer">{fmt(seconds)}</strong><button className="primary wide" onClick={()=>{if(ended){setEnded(false);setStarted(false);setSeconds(0);setCount(0);setSelected(1)}else setStarted(true)}}><Play size={18}/>{started?"Interview Running":ended?"Restart Interview":"Start Interview"}</button></Glass>
        <Glass className="session-settings-card"><CardHead icon={<Settings2/>} title="Session Settings"/><label>Category<select><option>Resume-based</option><option>Technical</option><option>Behavioral</option></select></label><label>Difficulty<select><option>Medium</option><option>Easy</option><option>Hard</option></select></label><label>Interview Type<select><option>Technical</option><option>Behavioral</option><option>Mixed</option></select></label><label>Questions<select><option>10 questions</option><option>5 questions</option><option>15 questions</option></select></label></Glass>
      </div>
      <div className="interview-bottom-row">
        <Glass className="interview-chat-card"><CardHead icon={<MessageSquare/>} title="Interview Chat" link={chatExpanded?"Back to dashboard":"Expand chat"} onClick={()=>setChatExpanded(v=>!v)}/><div className="interview-chat-scroll"><div className="interview-message"><span className="ai-badge">AI</span><div><b>Hello! 👋</b><p>Let’s start your practice interview. I’ll ask questions based on your resume and selected role. Take your time and answer naturally.</p></div></div><div className="interview-message"><span className="ai-badge">AI</span><div><b>{started?`Question ${selected}:`:"Here’s your first question:"}</b><p>{questions[selected-1]}</p></div></div>{count>0&&<div className="interview-message user-message"><span className="ai-badge">You</span><div><b>Answer submitted</b><p>Your response has been added to this practice session.</p></div></div>}</div><div className="interview-answer"><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Type your answer here..."/><button className="record-button" title="Record answer" onClick={()=>alert("Voice recording can be connected when the audio backend is added.")}><Mic/></button><button className="send" onClick={send} disabled={!started||ended||!answer.trim()} aria-label="Send answer"><Send/></button></div></Glass>
        <div className="interview-right-stack"><Glass className="question-navigator"><CardHead icon={<FileText/>} title="Question Navigator"/><div className="question-number-grid">{questions.map((_,i)=><button key={i} className={`${selected===i+1?"current":""} ${i<count?"attempted":""}`} onClick={()=>choose(i+1)}>{i+1}</button>)}</div><div className="question-legend"><span><i className="legend-current"/>Current</span><span><i/>Not Attempted</span><span><i className="legend-attempted"/>Attempted</span><span><i className="legend-skipped"/>Skipped</span></div></Glass>
          <Glass className="previous-questions"><CardHead icon={<Clock3/>} title="Previous Questions" link="View All" onClick={()=>setShowPrevious(true)}/>{questions.slice(0,4).map((q,i)=><button className="previous-question-row" key={q} onClick={()=>choose(i+1)}><b>{i+1}</b><span>{q}</span><ChevronRight/></button>)}</Glass>
        </div>
      </div>
    </div>
    {showPrevious&&<DetailModal title="All Interview Questions" onClose={()=>setShowPrevious(false)}>{questions.map((q,i)=><button className="previous-question-row" key={q} onClick={()=>{choose(i+1);setShowPrevious(false)}}><b>{i+1}</b><span>{q}</span><ChevronRight/></button>)}</DetailModal>}
  </AppShell>
}

function KeyboardIcon(){return <span style={{fontSize:16}}>⌨</span>}

function Profile({setPage}) {
  return <AppShell page="profile" setPage={setPage}><PageTitle title="Profile" subtitle="Your CareerSage account details."/><Glass className="profile-card"><Logo/><h2>{currentName()}</h2><p>{currentAccount()?.email || APP_DATA.user.email}</p><p>{currentAccount()?.phone || APP_DATA.user.phone}</p><button className="secondary" onClick={()=>{localStorage.removeItem("cs-user");setPage("landing")}}>Log out</button></Glass></AppShell>
}

function App(){
 const [page,setPage]=useState("landing"); const [signedIn,setSignedIn]=useState(()=>!!localStorage.getItem("cs-user"));
 const onAuth=account=>{APP_DATA.user.name=account.username;APP_DATA.user.email=account.email;APP_DATA.user.phone=account.phone;setSignedIn(true);setPage(localStorage.getItem(`cs-resume-name:${account.email}`)?"home":"upload");};
 const logout=()=>{localStorage.removeItem("cs-user");setSignedIn(false);setPage("landing");};
 if(page==="landing") return <Landing go={()=>setPage("login")}/>;
 if(page==="login") return <Login goCreate={()=>setPage("create")} onLogin={onAuth} goLanding={()=>setPage("landing")}/>;
 if(page==="create") return <CreateAccount goLogin={()=>setPage("login")} onCreate={onAuth}/>;
 if(page==="upload") return <ResumeUpload setPage={setPage}/>;
 if(page==="analyzing") return <Analyzing setPage={setPage}/>;
 if(page==="done") return <Done setPage={setPage}/>;
 if(page==="home") return <Dashboard setPage={setPage}/>;
 if(page==="resume") return <ResumeAnalysis setPage={setPage}/>;
 if(page==="preparation") return <Preparation setPage={setPage}/>;
 if(page==="interview") return <Interview setPage={setPage}/>;
 if(page==="progress") return <ProgressPage p={APP_DATA.preparation} setPage={setPage} back={()=>setPage("preparation")}/>;
 if(page==="profile") return <Profile setPage={setPage}/>;
 return <Landing go={()=>setPage("login")}/>;
}
createRoot(document.getElementById("root")).render(<App/>);
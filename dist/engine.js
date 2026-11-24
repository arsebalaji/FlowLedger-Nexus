export const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function addDays(date,n){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+Number(n));return d.toISOString().slice(0,10);}
export const month=date=>date.slice(0,7);
export const uid=()=>crypto.randomUUID();
export const paid=(s,id)=>s.payments.filter(p=>p.invoiceId===id).reduce((a,p)=>a+p.amount,0);
export const balance=(s,i)=>Math.max(0,i.amount-paid(s,i.id));
export const status=(s,i,date=today())=>balance(s,i)===0?'Paid':i.due<date?'Overdue':paid(s,i.id)>0?'Partial':'Unpaid';
export const cash=s=>s.opening+s.payments.reduce((a,p)=>a+p.amount,0)-s.expenses.filter(e=>e.paid).reduce((a,e)=>a+e.amount,0);
export function recordPayment(s,id,amount,date,method){const i=s.invoices.find(x=>x.id===id);if(!i||!Number.isFinite(amount)||amount<=0||Math.round(amount)!==amount||amount>balance(s,i))throw Error('Enter a whole-rupee amount between ₹1 and the outstanding balance.');if(!date||date>today())throw Error('A received payment cannot have a future date.');s.payments.push({id:uid(),invoiceId:id,amount,date,method});}
export function billMonth(s,period){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(period))throw Error('Choose a valid billing month.');let count=0;for(const st of s.students.filter(x=>!x.archived)){if(s.invoices.some(i=>i.studentId===st.id&&i.period===period))continue;s.invoices.push({id:uid(),studentId:st.id,period,amount:st.fee,due:period+'-05',created:today()});count++;}return count;}
export function forecast(s,{days=30,delay=0,rate=100,extra=0,extraDay=7}={},date=today()){
 let value=cash(s);const events={};const put=(d,n)=>events[d]=(events[d]||0)+n;
 for(const i of s.invoices){let remaining=balance(s,i);if(!remaining)continue;const promises=s.promises.filter(p=>p.invoiceId===i.id&&p.date>=date).sort((a,b)=>a.date.localeCompare(b.date));for(const p of promises){const amount=Math.min(remaining,p.amount);put(addDays(p.date,delay),amount*rate/100);remaining-=amount;}if(remaining){const expected=i.due>=date?i.due:addDays(date,7);put(addDays(expected,delay),remaining*rate/100);}}
 for(const e of s.expenses.filter(x=>!x.paid))put(e.due<date?date:e.due,-e.amount);
 if(extra)put(addDays(date,extraDay),-extra);
 return Array.from({length:days+1},(_,i)=>{const d=addDays(date,i);value+=events[d]||0;return {date:d,value:Math.round(value),change:Math.round(events[d]||0)};});
}
export function leakages(s,period=month(today())){return s.students.filter(st=>!st.archived&&!s.invoices.some(i=>i.studentId===st.id&&i.period===period));}
export function seed(){const d=today();const students=[['Aarav Sharma','Priya Sharma','Mathematics · Grade 10',3500],['Diya Patel','Rohan Patel','Science · Grade 9',3000],['Rahul Kumar','Anita Kumar','Mathematics · Grade 10',3500],['Ananya Rao','Meera Rao','English · Grade 8',2500],['Ishaan Mehta','Kiran Mehta','Science · Grade 9',3000],['Zoya Khan','Sara Khan','English · Grade 8',2500],['Arjun Nair','Dev Nair','Mathematics · Grade 10',3500],['Kavya Iyer','Lakshmi Iyer','Science · Grade 9',3000]].map((a,i)=>({id:'s'+i,name:a[0],parent:a[1],batch:a[2],fee:a[3],phone:'',archived:false}));
 return {version:1,business:'Bright Minds Academy',opening:18500,reserve:10000,students,invoices:students.slice(0,7).map((s,i)=>({id:'inv'+i,studentId:s.id,amount:s.fee,period:month(d),due:addDays(d,[-12,3,-8,5,7,-3,10][i]),created:addDays(d,-15)})),payments:[{id:'p0',invoiceId:'inv0',amount:1500,date:addDays(d,-2),method:'UPI'},{id:'p1',invoiceId:'inv3',amount:2500,date:addDays(d,-1),method:'Cash'}],expenses:[{id:'e0',title:'Studio rent',category:'Rent',amount:18000,due:addDays(d,5),paid:false},{id:'e1',title:'Teacher salaries',category:'Salaries',amount:16500,due:addDays(d,9),paid:false},{id:'e2',title:'Learning materials',category:'Supplies',amount:2200,due:addDays(d,15),paid:false}],promises:[{id:'pr0',invoiceId:'inv2',amount:2000,date:addDays(d,2)}],scenarios:[],audit:[],demo:true};
}

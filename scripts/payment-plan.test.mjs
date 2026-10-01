import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultPaymentPlan, planError, stageBalances, singleStagePayment, validDay } from '../lib/payment-plan.ts';
const project = {id:'p', total:40000};
const payment = (id, amount, paid_on='2026-10-01') => ({id, project_id:'p', amount, paid_on, created_at:paid_on, client_id:'c'});

test('50/50 is an agreement, never a recorded payment', () => {
 const stages=stageBalances(project,[]);
 assert.deepEqual(stages.map(s=>[s.expected,s.paid,s.remaining]),[[20000,0,20000],[20000,0,20000]]);
 assert.equal(planError(defaultPaymentPlan(),40000),null);
});
test('partial deposits, split transfers, final settlement and excess credit',()=>{
 const stages=stageBalances(project,[payment('a',8000),payment('b',12000),payment('c',25000,'2026-10-02')]);
 assert.deepEqual(stages.map(s=>[s.paid,s.remaining]),[[20000,0],[20000,0]]);
 assert.equal(stages[0].contributions.length,2);
 assert.equal(singleStagePayment(stages[0],stages),null);
 assert.equal(singleStagePayment(stages[1],stages)?.id,'c');
});
test('one transfer covering two stages is edited once in the ledger',()=>{
 const stages=stageBalances(project,[payment('a',30000)]);
 assert.equal(stages[1].paid,10000);
 assert.equal(singleStagePayment(stages[0],stages),null);
 assert.equal(singleStagePayment(stages[1],stages),null);
});
test('correcting dates reallocates stages chronologically without mutating payments',()=>{
 const payments=[payment('a',20000,'2026-10-15'),payment('b',20000,'2026-10-01')];
 const before=structuredClone(payments);
 const stages=stageBalances(project,payments);
 assert.equal(singleStagePayment(stages[0],stages).id,'b');
 assert.equal(singleStagePayment(stages[1],stages).id,'a');
 assert.deepEqual(payments,before);
});
test('mixed percentages and fixed installments leave exact remainder in cents',()=>{
 const plan={stages:[{id:'a',label:'Anticipo',kind:'percent',value:30,dueOn:null},{id:'b',label:'Revisión',kind:'amount',value:5000,dueOn:'2026-10-10'},{id:'c',label:'Finiquito',kind:'remainder',value:0,dueOn:null}]};
 assert.equal(planError(plan,40000),null);
 assert.deepEqual(stageBalances(project,[],plan).map(s=>s.expected),[12000,5000,23000]);
 assert.equal(stageBalances({id:'p',total:0.03},[]).reduce((n,s)=>n+s.expected,0),0.03);
});
test('rejects invalid dates, oversized plans, duplicate IDs and overcommitted totals',()=>{
 const plan=defaultPaymentPlan(); plan.stages[0].dueOn='2026-02-30';assert.ok(planError(plan,40000));
 plan.stages[0].dueOn=null;plan.stages[0].value=101;assert.ok(planError(plan,40000));
 plan.stages[0].kind='amount';plan.stages[0].value=40001;assert.ok(planError(plan,40000));
 plan.stages[0].value=20000;plan.stages[1].id='deposit';assert.ok(planError(plan,40000));
 assert.ok(planError({stages:[]},40000));
 assert.equal(validDay('2024-02-29'),true);assert.equal(validDay('2026-02-29'),false);
});
test('payments for another project never cover this plan',()=>{
 const stages=stageBalances(project,[{...payment('other',40000),project_id:'other'}]);
 assert.equal(stages.reduce((n,s)=>n+s.paid,0),0);
});

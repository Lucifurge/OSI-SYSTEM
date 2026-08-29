import {createClient} from "https://esm.sh/@supabase/supabase-js@2";
import "./config.js";
if(!window.SUPABASE_URL||window.SUPABASE_URL.startsWith("YOUR_")||!window.SUPABASE_ANON_KEY||window.SUPABASE_ANON_KEY.startsWith("YOUR_")) console.warn("Configure js/config.js before deployment.");
export const supabase=createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
export const $=(s,r=document)=>r.querySelector(s);
export const $$=(s,r=document)=>[...r.querySelectorAll(s)];
export const esc=(v="")=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
export const money=v=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:2}).format(Number(v||0));
export const fmtDate=v=>v?new Date(v).toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric"}):"—";
export const today=()=>new Date().toISOString().slice(0,10);
export function toast(msg,ok=true){const e=document.createElement("div");e.className="toast";e.textContent=msg;document.body.append(e);setTimeout(()=>e.remove(),3500)}
export async function requireAuth(){const {data:{session}}=await supabase.auth.getSession();if(!session){location.href="index.html";return null}return session}
export async function getProfile(){const {data:{user}}=await supabase.auth.getUser();if(!user)return null;const {data,error}=await supabase.from("profiles").select("*,roles(id,name,permissions)").eq("id",user.id).maybeSingle();if(error)throw error;return data}
export const roleName=p=>p?.roles?.name||"user";
export const isAdmin=p=>["admin","super_admin"].includes(roleName(p));
export const isSuperAdmin=p=>roleName(p)==="super_admin";
export const canManage=(p,perm="manage_inventory")=>isAdmin(p)&&(!p?.roles?.permissions||p.roles.permissions[perm]!==false);
export async function logout(){await supabase.auth.signOut();location.href="index.html"}
export function setApp(html){$("#app").innerHTML=html}
export function openModal(title,body){const wrap=document.createElement("div");wrap.className="modal-backdrop";wrap.innerHTML=`<div class="modal"><div class="modal-head"><h3 class="font-black text-lg">${esc(title)}</h3><button class="modal-close">✕</button></div><div class="modal-body">${body}</div></div>`;document.body.append(wrap);wrap.querySelector(".modal-close").onclick=()=>wrap.remove();wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};return wrap.querySelector(".modal")}
export async function log(action,entity_type=null,entity_id=null,details={}){try{await supabase.from("activity_log").insert({user_id:(await supabase.auth.getUser()).data.user?.id,action,entity_type,entity_id,details})}catch(e){console.warn("activity log",e.message)}}
export async function shell(title){
 const s=await requireAuth();if(!s)return null;let p=await getProfile();if(!p){toast("Your profile has not been created yet.",false);await logout();return null}
 document.title=`${title} · OSI Inventory`;
 const nav=[["dashboard.html","Dashboard","⌂"],["inventory.html","Inventory","▣"],["requests.html","Requests","↗"],["borrowing.html","Borrowing","↔"],["returns.html","Returns","↩"],["categories.html","Categories","#"],["finance.html","Finance","₱"],["reports.html","Reports","▤"],["activity.html","Activity","◷"],["admin.html","Admin","⚙"],["profile.html","My Profile","♙"]];
 const links=nav.filter(x=>x[1]!=="Admin"||isAdmin(p)).map(x=>`<a href="${x[0]}" class="sidebar-link ${location.pathname.endsWith(x[0])?"active":""} flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold"><span>${x[2]}</span>${x[1]}</a>`).join("");
 document.body.innerHTML=`<div class="min-h-screen"><aside id="side" class="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white p-4 lg:block"><div class="mb-7 flex items-center gap-3 px-2"><div class="logo-mark">OSI</div><div><div class="font-black">OSI Inventory</div><div class="text-xs text-slate-500">FEBIAS College of Bible</div></div></div><nav class="space-y-1">${links}</nav><div class="absolute bottom-4 left-4 right-4"><button id="logout" class="btn btn-secondary w-full">Sign out</button></div></aside><div class="lg:pl-64"><header class="sticky top-0 z-30 border-b bg-white/95 backdrop-blur"><div class="flex h-16 items-center justify-between px-4 sm:px-6"><div class="flex items-center"><button id="menu" class="mr-3 rounded-lg p-2 lg:hidden">☰</button><span class="font-black">${esc(title)}</span></div><div class="flex items-center gap-3"><div class="hidden text-right sm:block"><div class="text-sm font-bold">${esc(p.full_name||"User")}</div><div class="text-xs text-slate-500">${esc(roleName(p))}</div></div><div class="logo-mark !w-9 !h-9 !rounded-full">${esc((p.full_name||"U")[0].toUpperCase())}</div></div></div></header><main id="app" class="p-4 sm:p-6"></main></div></div>`;
 $("#logout").onclick=logout;$("#menu").onclick=()=>$("#side").classList.toggle("hidden");return p;
}

(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();class N{add(e,t,r){if(typeof arguments[0]!="string")for(let s in arguments[0])this.add(s,arguments[0][s],arguments[1]);else(Array.isArray(e)?e:[e]).forEach(function(s){this[s]=this[s]||[],t&&this[s][r?"unshift":"push"](t)},this)}run(e,t){this[e]=this[e]||[],this[e].forEach(function(r){r.call(t&&t.context?t.context:t,t)})}}class X{constructor(e){this.jsep=e,this.registered={}}register(...e){e.forEach(t=>{if(typeof t!="object"||!t.name||!t.init)throw new Error("Invalid JSEP plugin format");this.registered[t.name]||(t.init(this.jsep),this.registered[t.name]=t)})}}class i{static get version(){return"1.3.8"}static toString(){return"JavaScript Expression Parser (JSEP) v"+i.version}static addUnaryOp(e){return i.max_unop_len=Math.max(e.length,i.max_unop_len),i.unary_ops[e]=1,i}static addBinaryOp(e,t,r){return i.max_binop_len=Math.max(e.length,i.max_binop_len),i.binary_ops[e]=t,r?i.right_associative.add(e):i.right_associative.delete(e),i}static addIdentifierChar(e){return i.additional_identifier_chars.add(e),i}static addLiteral(e,t){return i.literals[e]=t,i}static removeUnaryOp(e){return delete i.unary_ops[e],e.length===i.max_unop_len&&(i.max_unop_len=i.getMaxKeyLen(i.unary_ops)),i}static removeAllUnaryOps(){return i.unary_ops={},i.max_unop_len=0,i}static removeIdentifierChar(e){return i.additional_identifier_chars.delete(e),i}static removeBinaryOp(e){return delete i.binary_ops[e],e.length===i.max_binop_len&&(i.max_binop_len=i.getMaxKeyLen(i.binary_ops)),i.right_associative.delete(e),i}static removeAllBinaryOps(){return i.binary_ops={},i.max_binop_len=0,i}static removeLiteral(e){return delete i.literals[e],i}static removeAllLiterals(){return i.literals={},i}get char(){return this.expr.charAt(this.index)}get code(){return this.expr.charCodeAt(this.index)}constructor(e){this.expr=e,this.index=0}static parse(e){return new i(e).parse()}static getMaxKeyLen(e){return Math.max(0,...Object.keys(e).map(t=>t.length))}static isDecimalDigit(e){return e>=48&&e<=57}static binaryPrecedence(e){return i.binary_ops[e]||0}static isIdentifierStart(e){return e>=65&&e<=90||e>=97&&e<=122||e>=128&&!i.binary_ops[String.fromCharCode(e)]||i.additional_identifier_chars.has(String.fromCharCode(e))}static isIdentifierPart(e){return i.isIdentifierStart(e)||i.isDecimalDigit(e)}throwError(e){const t=new Error(e+" at character "+this.index);throw t.index=this.index,t.description=e,t}runHook(e,t){if(i.hooks[e]){const r={context:this,node:t};return i.hooks.run(e,r),r.node}return t}searchHook(e){if(i.hooks[e]){const t={context:this};return i.hooks[e].find(function(r){return r.call(t.context,t),t.node}),t.node}}gobbleSpaces(){let e=this.code;for(;e===i.SPACE_CODE||e===i.TAB_CODE||e===i.LF_CODE||e===i.CR_CODE;)e=this.expr.charCodeAt(++this.index);this.runHook("gobble-spaces")}parse(){this.runHook("before-all");const e=this.gobbleExpressions(),t=e.length===1?e[0]:{type:i.COMPOUND,body:e};return this.runHook("after-all",t)}gobbleExpressions(e){let t=[],r,s;for(;this.index<this.expr.length;)if(r=this.code,r===i.SEMCOL_CODE||r===i.COMMA_CODE)this.index++;else if(s=this.gobbleExpression())t.push(s);else if(this.index<this.expr.length){if(r===e)break;this.throwError('Unexpected "'+this.char+'"')}return t}gobbleExpression(){const e=this.searchHook("gobble-expression")||this.gobbleBinaryExpression();return this.gobbleSpaces(),this.runHook("after-expression",e)}gobbleBinaryOp(){this.gobbleSpaces();let e=this.expr.substr(this.index,i.max_binop_len),t=e.length;for(;t>0;){if(i.binary_ops.hasOwnProperty(e)&&(!i.isIdentifierStart(this.code)||this.index+e.length<this.expr.length&&!i.isIdentifierPart(this.expr.charCodeAt(this.index+e.length))))return this.index+=t,e;e=e.substr(0,--t)}return!1}gobbleBinaryExpression(){let e,t,r,s,o,a,c,u,P;if(a=this.gobbleToken(),!a||(t=this.gobbleBinaryOp(),!t))return a;for(o={value:t,prec:i.binaryPrecedence(t),right_a:i.right_associative.has(t)},c=this.gobbleToken(),c||this.throwError("Expected expression after "+t),s=[a,o,c];t=this.gobbleBinaryOp();){if(r=i.binaryPrecedence(t),r===0){this.index-=t.length;break}o={value:t,prec:r,right_a:i.right_associative.has(t)},P=t;const B=O=>o.right_a&&O.right_a?r>O.prec:r<=O.prec;for(;s.length>2&&B(s[s.length-2]);)c=s.pop(),t=s.pop().value,a=s.pop(),e={type:i.BINARY_EXP,operator:t,left:a,right:c},s.push(e);e=this.gobbleToken(),e||this.throwError("Expected expression after "+P),s.push(o,e)}for(u=s.length-1,e=s[u];u>1;)e={type:i.BINARY_EXP,operator:s[u-1].value,left:s[u-2],right:e},u-=2;return e}gobbleToken(){let e,t,r,s;if(this.gobbleSpaces(),s=this.searchHook("gobble-token"),s)return this.runHook("after-token",s);if(e=this.code,i.isDecimalDigit(e)||e===i.PERIOD_CODE)return this.gobbleNumericLiteral();if(e===i.SQUOTE_CODE||e===i.DQUOTE_CODE)s=this.gobbleStringLiteral();else if(e===i.OBRACK_CODE)s=this.gobbleArray();else{for(t=this.expr.substr(this.index,i.max_unop_len),r=t.length;r>0;){if(i.unary_ops.hasOwnProperty(t)&&(!i.isIdentifierStart(this.code)||this.index+t.length<this.expr.length&&!i.isIdentifierPart(this.expr.charCodeAt(this.index+t.length)))){this.index+=r;const o=this.gobbleToken();return o||this.throwError("missing unaryOp argument"),this.runHook("after-token",{type:i.UNARY_EXP,operator:t,argument:o,prefix:!0})}t=t.substr(0,--r)}i.isIdentifierStart(e)?(s=this.gobbleIdentifier(),i.literals.hasOwnProperty(s.name)?s={type:i.LITERAL,value:i.literals[s.name],raw:s.name}:s.name===i.this_str&&(s={type:i.THIS_EXP})):e===i.OPAREN_CODE&&(s=this.gobbleGroup())}return s?(s=this.gobbleTokenProperty(s),this.runHook("after-token",s)):this.runHook("after-token",!1)}gobbleTokenProperty(e){this.gobbleSpaces();let t=this.code;for(;t===i.PERIOD_CODE||t===i.OBRACK_CODE||t===i.OPAREN_CODE||t===i.QUMARK_CODE;){let r;if(t===i.QUMARK_CODE){if(this.expr.charCodeAt(this.index+1)!==i.PERIOD_CODE)break;r=!0,this.index+=2,this.gobbleSpaces(),t=this.code}this.index++,t===i.OBRACK_CODE?(e={type:i.MEMBER_EXP,computed:!0,object:e,property:this.gobbleExpression()},this.gobbleSpaces(),t=this.code,t!==i.CBRACK_CODE&&this.throwError("Unclosed ["),this.index++):t===i.OPAREN_CODE?e={type:i.CALL_EXP,arguments:this.gobbleArguments(i.CPAREN_CODE),callee:e}:(t===i.PERIOD_CODE||r)&&(r&&this.index--,this.gobbleSpaces(),e={type:i.MEMBER_EXP,computed:!1,object:e,property:this.gobbleIdentifier()}),r&&(e.optional=!0),this.gobbleSpaces(),t=this.code}return e}gobbleNumericLiteral(){let e="",t,r;for(;i.isDecimalDigit(this.code);)e+=this.expr.charAt(this.index++);if(this.code===i.PERIOD_CODE)for(e+=this.expr.charAt(this.index++);i.isDecimalDigit(this.code);)e+=this.expr.charAt(this.index++);if(t=this.char,t==="e"||t==="E"){for(e+=this.expr.charAt(this.index++),t=this.char,(t==="+"||t==="-")&&(e+=this.expr.charAt(this.index++));i.isDecimalDigit(this.code);)e+=this.expr.charAt(this.index++);i.isDecimalDigit(this.expr.charCodeAt(this.index-1))||this.throwError("Expected exponent ("+e+this.char+")")}return r=this.code,i.isIdentifierStart(r)?this.throwError("Variable names cannot start with a number ("+e+this.char+")"):(r===i.PERIOD_CODE||e.length===1&&e.charCodeAt(0)===i.PERIOD_CODE)&&this.throwError("Unexpected period"),{type:i.LITERAL,value:parseFloat(e),raw:e}}gobbleStringLiteral(){let e="";const t=this.index,r=this.expr.charAt(this.index++);let s=!1;for(;this.index<this.expr.length;){let o=this.expr.charAt(this.index++);if(o===r){s=!0;break}else if(o==="\\")switch(o=this.expr.charAt(this.index++),o){case"n":e+=`
`;break;case"r":e+="\r";break;case"t":e+="	";break;case"b":e+="\b";break;case"f":e+="\f";break;case"v":e+="\v";break;default:e+=o}else e+=o}return s||this.throwError('Unclosed quote after "'+e+'"'),{type:i.LITERAL,value:e,raw:this.expr.substring(t,this.index)}}gobbleIdentifier(){let e=this.code,t=this.index;for(i.isIdentifierStart(e)?this.index++:this.throwError("Unexpected "+this.char);this.index<this.expr.length&&(e=this.code,i.isIdentifierPart(e));)this.index++;return{type:i.IDENTIFIER,name:this.expr.slice(t,this.index)}}gobbleArguments(e){const t=[];let r=!1,s=0;for(;this.index<this.expr.length;){this.gobbleSpaces();let o=this.code;if(o===e){r=!0,this.index++,e===i.CPAREN_CODE&&s&&s>=t.length&&this.throwError("Unexpected token "+String.fromCharCode(e));break}else if(o===i.COMMA_CODE){if(this.index++,s++,s!==t.length){if(e===i.CPAREN_CODE)this.throwError("Unexpected token ,");else if(e===i.CBRACK_CODE)for(let a=t.length;a<s;a++)t.push(null)}}else if(t.length!==s&&s!==0)this.throwError("Expected comma");else{const a=this.gobbleExpression();(!a||a.type===i.COMPOUND)&&this.throwError("Expected comma"),t.push(a)}}return r||this.throwError("Expected "+String.fromCharCode(e)),t}gobbleGroup(){this.index++;let e=this.gobbleExpressions(i.CPAREN_CODE);if(this.code===i.CPAREN_CODE)return this.index++,e.length===1?e[0]:e.length?{type:i.SEQUENCE_EXP,expressions:e}:!1;this.throwError("Unclosed (")}gobbleArray(){return this.index++,{type:i.ARRAY_EXP,elements:this.gobbleArguments(i.CBRACK_CODE)}}}const Y=new N;Object.assign(i,{hooks:Y,plugins:new X(i),COMPOUND:"Compound",SEQUENCE_EXP:"SequenceExpression",IDENTIFIER:"Identifier",MEMBER_EXP:"MemberExpression",LITERAL:"Literal",THIS_EXP:"ThisExpression",CALL_EXP:"CallExpression",UNARY_EXP:"UnaryExpression",BINARY_EXP:"BinaryExpression",ARRAY_EXP:"ArrayExpression",TAB_CODE:9,LF_CODE:10,CR_CODE:13,SPACE_CODE:32,PERIOD_CODE:46,COMMA_CODE:44,SQUOTE_CODE:39,DQUOTE_CODE:34,OPAREN_CODE:40,CPAREN_CODE:41,OBRACK_CODE:91,CBRACK_CODE:93,QUMARK_CODE:63,SEMCOL_CODE:59,COLON_CODE:58,unary_ops:{"-":1,"!":1,"~":1,"+":1},binary_ops:{"||":1,"&&":2,"|":3,"^":4,"&":5,"==":6,"!=":6,"===":6,"!==":6,"<":7,">":7,"<=":7,">=":7,"<<":8,">>":8,">>>":8,"+":9,"-":9,"*":10,"/":10,"%":10},right_associative:new Set,additional_identifier_chars:new Set(["$","_"]),literals:{true:!0,false:!1,null:null},this_str:"this"});i.max_unop_len=i.getMaxKeyLen(i.unary_ops);i.max_binop_len=i.getMaxKeyLen(i.binary_ops);const f=n=>new i(n).parse(),j=Object.getOwnPropertyNames(i);j.forEach(n=>{f[n]===void 0&&n!=="prototype"&&(f[n]=i[n])});f.Jsep=i;const K="ConditionalExpression";var H={name:"ternary",init(n){n.hooks.add("after-expression",function(t){if(t.node&&this.code===n.QUMARK_CODE){this.index++;const r=t.node,s=this.gobbleExpression();if(s||this.throwError("Expected expression"),this.gobbleSpaces(),this.code===n.COLON_CODE){this.index++;const o=this.gobbleExpression();if(o||this.throwError("Expected expression"),t.node={type:K,test:r,consequent:s,alternate:o},r.operator&&n.binary_ops[r.operator]<=.9){let a=r;for(;a.right.operator&&n.binary_ops[a.right.operator]<=.9;)a=a.right;t.node.test=a.right,a.right=t.node,t.node=r}}else this.throwError("Expected :")}})}};f.plugins.register(H);const C=43,$=45,p={name:"assignment",assignmentOperators:new Set(["=","*=","**=","/=","%=","+=","-=","<<=",">>=",">>>=","&=","^=","|="]),updateOperators:[C,$],assignmentPrecedence:.9,init(n){const e=[n.IDENTIFIER,n.MEMBER_EXP];p.assignmentOperators.forEach(r=>n.addBinaryOp(r,p.assignmentPrecedence,!0)),n.hooks.add("gobble-token",function(s){const o=this.code;p.updateOperators.some(a=>a===o&&a===this.expr.charCodeAt(this.index+1))&&(this.index+=2,s.node={type:"UpdateExpression",operator:o===C?"++":"--",argument:this.gobbleTokenProperty(this.gobbleIdentifier()),prefix:!0},(!s.node.argument||!e.includes(s.node.argument.type))&&this.throwError(`Unexpected ${s.node.operator}`))}),n.hooks.add("after-token",function(s){if(s.node){const o=this.code;p.updateOperators.some(a=>a===o&&a===this.expr.charCodeAt(this.index+1))&&(e.includes(s.node.type)||this.throwError(`Unexpected ${s.node.operator}`),this.index+=2,s.node={type:"UpdateExpression",operator:o===C?"++":"--",argument:s.node,prefix:!1})}}),n.hooks.add("after-expression",function(s){s.node&&t(s.node)});function t(r){p.assignmentOperators.has(r.operator)?(r.type="AssignmentExpression",t(r.left),t(r.right)):r.operator||Object.values(r).forEach(s=>{s&&typeof s=="object"&&t(s)})}}};class v{constructor(){this.config={}}unwrapMulti(e){e.maxSep=e.separators?typeof e.maxSep>"u"?1/0:e.maxSep:0}addExtra(e,t,r){return e.extra?typeof e.extra=="function"?e.extra(t,r):Object.assign(Object.assign({},e.extra),t):t}register(){return{}}pre(e){return null}post(e,t){return t}}class F extends v{constructor(e,t=!1){super(),this.config=e,this.required=t;let r;for(const s in e)r=e[s],r.empty=r.close&&r.empty||!1,r.separators=r.close&&r.separators||"",this.unwrapMulti(r)}register(){return this.config}post(e,t){const r=t.range?t.range[0]:e.i;let s=e.gbOp(this.config);if(this.required&&!s)return e.err(`Expected operator (${Object.keys(this.config).join(",")})`);for(;s;){const o=this.config[s];if(o.ltypes&&o.ltypes.indexOf(t.type)<0)return e.err("Invalid left-hand side");const a=e.parseMulti(o,o.subRules||(o.rasoc?0:1));if(!a.length&&!o.empty)return e.err("Expression expected.");if(delete a.match,o.close&&!e.tyCh(o.close))return e.err("Closing character expected. Found");t=this.addExtra(o,{type:o.type,[o.left||"left"]:t,[o.right||"right"]:o.separators?a:a[0]},e),o.oper&&(t[o.oper]=s),e.config.range&&(t.range=[r,e.ch]),s=o.rasoc?"":e.gbOp(this.config)}return t}}const A="BinaryExpression",q="LogicalExpression",R="ArrayPattern",Q="Literal",G="Identifier",b="MemberExpression",V="UpdateExpression",L="UnaryExpression",W="RestElement",y="operator",k="prefix",Z="object",w="property",z="expression";function M(n,e,t){const r=e[n].findIndex(s=>s&&s.type===W);return r>=0&&r!==e[n].length-1&&t.err("rest element must be the last"),e}const h={type:A,oper:y},T=Object.assign(Object.assign({},h),{space:!0}),D={type:q,oper:y},J={type:L,oper:y,prefix:k},ee=Object.assign(Object.assign({},J),{isPre:!0});Object.assign(Object.assign({},ee),{space:!0});const te={type:V,oper:y,prefix:k,types:[G,b]};Object.assign(Object.assign({},te),{isPre:!0});M.bind(null,"params");M.bind(null,"elements");const U={type:b,left:Z,right:w,extra:{computed:!1},subRules:w},re=Object.assign(Object.assign({},U),{close:"]",extra:{computed:!0},subRules:z});function l(n,e){const t={};Array.isArray(e)||(e=[e]),Array.isArray(n[0])||(n=[n]);for(let r=0;r<e.length;r++)for(let s=0;s<n[r].length;s++)t[n[r][s]]=e[r];return t}class E extends v{constructor(e={radix:10,decimal:!0,exp:!0}){if(super(),this.config=e,e.radix<2||e.radix>36)throw new RangeError("Radix out of range");let t=`0-${e.radix<10?e.radix-1:9}`;e.radix>10&&(t+=`A-${String.fromCharCode(64+e.radix-10)}`),e.radix!==10&&(e.decimal=!1,e.exp=!1),this.digits=new RegExp(`[${t}]`,"i"),e.prefix&&(this.prefix=new RegExp(`^${e.prefix}`,"i"))}pre(e){const t=this.config;let r="",s,o="";if(this.prefix){const a=this.prefix.exec(e.rest());if(!a)return null;o=a[0],e.gb(o.length)}for(;this.digits.test(e.gtCh());)r+=e.gbCh();if(t.decimal&&e.gtCh()===".")for(r+=e.gbCh();this.digits.test(e.gtCh());)r+=e.gbCh();if((!r||r===".")&&!o)return e.gb(-r.length),null;if(s=e.gtCh(),t.exp&&(s==="e"||s==="E")){for(r+=e.gbCh(),s=e.gtCh(),(s==="+"||s==="-")&&(r+=e.gbCh());this.digits.test(e.gtCh());)r+=e.gbCh();this.digits.test(e.gtCh(-1))||e.err(`Expected exponent (${r}${e.gtCh()})`)}return r.length?e.teIdSt()?e.err():{type:Q,value:t.decimal?parseFloat(r):parseInt(r,t.radix),raw:o+r}:e.err("Invalid number format")}}l(["==","!=","===","!=="],h),l([["<",">","<=",">="],["instanceof","in"]],[h,T]),l(["<<",">>",">>>"],h),l(["+","-"],h),l(["*","/","%"],h);new E({radix:16,prefix:"0x"}),new E({radix:8,prefix:"0o"}),new E({radix:2,prefix:"0b"}),new E;new F({".":U,"[":re});l(["==","!=","===","!=="],h),l(["<",">","<=",">="],T),l(["<<",">>",">>>"],h),l(["+","-"],h),l(["*","/","%"],h);class ie{evaluate(e,t){return this._eval(e,t||{})}_eval(e,t){try{if(!(e.type in this))throw new Error(`Unsupported expression type: ${e.type}`);return this[e.type](e,t)}catch(r){throw r.node||(r.node=e),r}}_resolve(e,t,r,...s){const o=s.map(a=>(a||void 0)&&this._eval(a,e));return r(...o)}}function m(n,e){return new Error(`Unsuported ${n}: ${e}`)}const _={"|":(n,e)=>n|e,"^":(n,e)=>n^e,"&":(n,e)=>n&e,"==":(n,e)=>n==e,"!=":(n,e)=>n!=e,"===":(n,e)=>n===e,"!==":(n,e)=>n!==e,"<":(n,e)=>n<e,">":(n,e)=>n>e,"<=":(n,e)=>n<=e,">=":(n,e)=>n>=e,instanceof:(n,e)=>n instanceof e,in:(n,e)=>n in e,"<<":(n,e)=>n<<e,">>":(n,e)=>n>>e,">>>":(n,e)=>n>>>e,"+":(n,e)=>n+e,"-":(n,e)=>n-e,"*":(n,e)=>n*e,"/":(n,e)=>n/e,"%":(n,e)=>n%e,"**":(n,e)=>n**e},I={"-":n=>-n,"+":n=>+n,"!":n=>!n,"~":n=>~n,typeof:n=>typeof n,void:n=>{}},d=0,g=1,S=2;class se extends ie{lvalue(e,t){return{o:{},m:""}}Literal(e){return e.value}Identifier(e,t){return t[e.name]}ThisExpression(e,t){return t}ArrayExpression(e,t){return this._resolve(t,0,(...r)=>r,...e.elements)}MemberExpression(e,t){return this._member(e,t,r=>r&&r.o[r.m])}_MemberObject(e,t){return this._member(e,t,r=>r)}_member(e,t,r){const s=e.optional||e.shortCircuited;return this._resolve(t,s?S+g:S,(o,a)=>s?o===null||typeof o>"u"?r(void 0):e.computed?this._resolve(t,d,c=>r({o,m:c}),e.property):r({o,m:e.property.name}):r({o,m:e.computed?a:e.property.name}),e.object,s||!e.computed?void 0:e.property)}CallExpression(e,t){const r=e.optional||e.shortCircuited,s=(o,a,c)=>{if(!(r&&(a===null||typeof a>"u"))){if(typeof a!="function")throw new TypeError("Callee is not a function");return r?this._resolve(t,d,(...u)=>a.apply(o,u),...e.arguments):a.apply(o,c)}};return this._resolve(t,g,(o,...a)=>e.callee.type===b?s(o==null?void 0:o.o,o==null?void 0:o.o[o.m],a):s(t,o,a),e.callee.type===b?Object.assign(Object.assign({},e.callee),{type:"_MemberObject"}):e.callee,...r?[]:e.arguments)}ConditionalExpression(e,t){return this._resolve(t,g,r=>this._eval(r?e.consequent:e.alternate,t),e.test)}SequenceExpression(e,t){return this._resolve(t,d,(...r)=>r.pop(),...e.expressions)}LogicalExpression(e,t){return this._resolve(t,g,r=>{switch(e.operator){case"||":return r||this._eval(e.right,t);case"&&":return r&&this._eval(e.right,t);case"??":return r??this._eval(e.right,t);case"##":return this._eval(e.right,t);default:throw m(A,e.operator)}},e.left)}BinaryExpression(e,t){if(!(e.operator in _))throw m(A,e.operator);return this._resolve(t,d,_[e.operator],e.left,e.right)}UnaryExpression(e,t){if(!(e.operator in I))throw m(L,e.operator);return this._resolve(t,d,I[e.operator],e.argument)}ExpressionStatement(e,t){return this._eval(e.expression,t)}Program(e,t){return this._resolve(t,d,(...r)=>r.pop(),...e.body)}Compound(e,t){return this.Program(e,t)}}f.plugins.register(p);function ne(n){let e=n,t=[];return{get value(){return e},set value(r){e=r,t.forEach(s=>s())},listeners:t}}const x={};function oe(n,e){x[n]=e}const ae=new se;function he(n,e){const t=f(n);return()=>ae.evaluate(t,e)}function le(n,e){const t=Object.keys(n.dataset);for(let r of t){if(r.startsWith("on")){const s=r.replace(/^on([A-Z])/,a=>a[2].toLowerCase());let o=n.dataset[r];n.addEventListener(s,he(o,e));continue}if(r==="bind"){const s=e[n.dataset[r]];s.listeners.push(()=>{n.innerText=s.value}),n.innerText=s.value}}}function ce(n,e){var s;const t=(s=x[n])==null?void 0:s.call(x,e);function r(o){for(let a of o)le(a,t),a.children&&r([...a.children])}r([...e.children])}function ue(){const n=[...document.querySelectorAll("[data-island-comp]")];for(let e of n)ce(e.dataset.islandComp,e)}function de(){let n=ne(0);function e(){n.value++}return{count:n,updateCount:e}}oe("App",de);ue();
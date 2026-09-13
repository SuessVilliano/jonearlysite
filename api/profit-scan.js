export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
    const required=['company','name','email','score'];
    for(const key of required){if(body?.[key]===undefined||body?.[key]==='') return res.status(400).json({ok:false,error:`Missing ${key}`});}
    const payload={
      event:'early_advisory_profit_scan_completed',
      capturedAt:new Date().toISOString(),
      ...body
    };
    const url=process.env.PROFIT_SCAN_WEBHOOK_URL||process.env.BOOKING_WEBHOOK_URL||'';
    if(url){
      const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!r.ok) console.error('Profit scan webhook failed',r.status,await r.text());
    }
    return res.status(200).json({ok:true});
  }catch(err){
    console.error(err);
    return res.status(500).json({ok:false,error:'Unable to process scan'});
  }
}

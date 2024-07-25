const { Hono } = require("hono");
const Stripe = require("stripe");
const app = new Hono();

app.get("/", async (context) => {
	
  const cs = context.req.query('cs');
  
  if ( cs === undefined || cs == "" ) {
	  
	  return context.html('🛒 get field from stripe checkout session <hr />cs_xxxx: <br /><br /><form action="/" method="get"><input type="text" name="cs"/><input type="submit" /></form>');
	  
  } else {
	  
	  try {
	  
	  const stripe = new Stripe(context.env.STRIPE_API_KEY);
	  
	  const session = await stripe.checkout.sessions.retrieve(cs);
	  
	  var formdata = session.custom_fields.find((element) => element.key == 'githubuseridgithubcomxxxxxx');
	  
	  // if (formdata === undefined) { return context.text("Custom field data not found. Key is wrong or field was left blank.") }
	  
	  var userid = ( formdata === undefined ? "" : formdata.text.value );
	  
	  return context.html('🛒 stripe checkout session <br />session: ' + cs 
	  + '<br />payment_status: ' + session.payment_status 
	  + '<br />userid: ' + userid
	  + '<hr />look up another checkout id? <br /><br /><form action="/" method="get"><input type="text" name="cs"/><input type="submit" /></form>');
	  
	  } catch (err) {
        const errorMessage = `⚠️ Error: ${err instanceof Error ? err.message : "Internal server error"}`
        console.log(errorMessage);
        return context.text(errorMessage, 400);
      }
	  
	  
  }
  
  
});

export default app;
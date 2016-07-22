import braintree


def lambda_handler(event, context):
	    # TODO implement
	    braintree.Configuration.configure(braintree.Environment.Sandbox,merchant_id="jgw9rr2crw44vwys",public_key="nn5h4b9bg9bkkvp8",private_key="97e6a857778480084f27c3f332e07b45")
	    result = braintree.Transaction.sale({
		  'amount': '10.00',
		  'payment_method_nonce': 'fake-valid-nonce',
		  'options': {
		    'submit_for_settlement': True
		  }
		})
	    return result
	   
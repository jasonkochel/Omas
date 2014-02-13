<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckAdminLogin

Server.ScriptTimeout = 600

cMode = Request("Mode")
cUserID = Session("UserID")

Set objOrder = Server.CreateObject("Omas.Orders")
Set oOrder = objOrder.LoadUserBatch("", "")
Call CheckDictError(oOrder)

Set objOrder = Server.CreateObject("Omas.Orders")
Set oBatch = objOrder.LoadBatch(Session("BatchID"))
Set objOrder = Nothing
%>
<html>
<head>

<title>OMA's Pride Ordering System</title>
<link rel="stylesheet" type="text/css" href="styles.css">

<style type="text/css">
BODY, TD {
	font-family: Arial;
	font-size: 12px;
}
.secheader {
	background-color: black;
	color: white;
	font-size: 14px;
	font-weight: bold;
}
.colheader {
	background-color: #aaaaaa;
	font-size: 12px;
	font-weight: bold;
}
.shadedrow {
	background-color: #cccccc;
}
</style>

</head>
<body>

<table width="761" border=0 cellspacing=0 cellpadding=0>
<tr>
	<td class="font-content" valign="top" align=center>
		<span class="headerlargegreen"><b>OMA's Pride Ordering System</b></span><br>
		<br>
		<TABLE WIDTH="750" BORDER="0" CELLSPACING="0" CELLPADDING="0">
		<tr>
			<td>
			<%
			cCustomerName = ""
			cEmail = ""
			cMessage = ""
			nTotal = 0
			nWeight = 0
			nOdd = 0
			nMinutes = 0.00

			For Each oItem in oOrder
				Set oRow = oOrder(oItem)

				If cCustomerName <> oRow("CustomerName") Then
					If nTotal > 0 Then
						cMessage = cMessage & "<tr><td colspan=6 align=right>&nbsp;</td></tr>"
						cMessage = cMessage & "<tr><td colspan=4 align=right><b>Subtotal:</b> </td><td>" & FormatCurrency(nTotal,2) & "</td></tr>"
						cMessage = cMessage & "<tr><td colspan=4 align=right><b>Weight:</b> </td><td>" & FormatNumber(nWeight,2) & " lbs</td></tr>"
						cMessage = cMessage & "<tr><td colspan=4 align=right><b>Shipping & Handling:</b> </td><td>" & FormatCurrency(nWeight * 0.20,2) & "</td></tr>"
						cMessage = cMessage & "<tr><td colspan=4 align=right><b>Total:</b> </td><td>" & FormatCurrency(nTotal + (nWeight * 0.20),2) & "</td></tr>"
						cMessage = cMessage & "</table></body></html>"

						Set cdoConfig = CreateObject("CDO.Configuration")
						sch = "http://schemas.microsoft.com/cdo/configuration/"
			 			With cdoConfig.Fields
					        .Item(sch & "sendusing") = 2
					        .Item(sch & "smtpserver") = "smtp.sendgrid.net"
					        .Item(sch & "smtpserverport") = 25
					        .Item(sch & "smtpauthenticate") = 1
					        .Item(sch & "sendusername") = "qxpress@marathondata.com"
					        .Item(sch & "sendpassword") = "QXpr3ss"
							.update
						End With

						Set cdoMessage = CreateObject("CDO.Message")

						With cdoMessage
							Set .Configuration = cdoConfig
							.From = "Diane Mellon<goldiggers@comcast.net>"
							.To = cEmail
							.Subject = "OMAs Pride Order Confirmation"
							.HTMLBody = cMessage
							.Send
						End With

						Set cdoMessage = Nothing
						Set cdoConfig = Nothing

						Response.Write "Sent to: " & cEmail & "<br>"

					End If
					cCustomerName = oRow("CustomerName")
					cEmail = oRow("Email")

					cPickupTime = FormatDateTime(DateAdd("s", CDbl(nMinutes) * 60.0, "5/21/2009 2:00 pm"), 3)
					cPickupTime = Left(cPickupTime,4) & " " & Right(cPickupTime,2)
					nMinutes = CDbl(nMinutes) + 1.5

					'	"<b>YOUR PICKUP TIME IS " & cPickupTime & "</b><p>"

					cMessage = "<html><body><b>Dear " & oRow("FName") & " " & oRow("LName") & ",</b><p>" & _
							"This is to confirm the order you have placed at OmasOrders.com.  Ordering is now closed.  " & _
							"You must pick up your order on " & FormatDateLong(oBatch("DeliveryDate")) & _
							".  If you have any questions, please contact Diane Mellon at goldiggers@comcast.net.<p>" & _
							"<b>MAKE CHECKS PAYABLE TO 'GOLDIGGERS'</b>" & _
							"<table width=750 cellspacing=0 cellpadding=2>"
					cMessage = cMessage & "<tr><td width=50><u>SKU</u></td><td width='*'><u>Description</u></td><td width=80><u>Price</u></td><td width=50><u>Qty</u></td><td width=80><u>Total</u></td><td width=50><u>Lbs</u></td></tr>"
					nTotal = 0
					nWeight = 0
					nOdd = 0
				End If
				nOdd = 1 - nOdd
				If nOdd = 1 Then
					cTR =  "<tr style='background-color: #eeeeee'>"
				Else
					cTR = "<tr>"
				End If
				nTotal = CDbl(nTotal) + (CDbl(oRow("Quantity")) * CDbl(oRow("Price")) * CDbl(oRow("Multiplier")))
				nWeight = CDbl(nWeight) + (CDbl(oRow("Quantity")) * CDbl(oRow("Weight")))
				If CDbl(oRow("Multiplier")) <> 1.0 Then lDisclaimer = True
				cMessage = cMessage & cTR & "<td>" & oRow("SKU") & "</td><td>" & oRow("Name") & _
							"</td><td>" & FormatNumber(oRow("Price"),2) & " / " & oRow("PricePer") & "</td>" & _
							"<td>" & oRow("Quantity")
				If oRow("OrderPer") <> "ea" Then cMessage = cMessage & " " & oRow("OrderPer")
				cMessage = cMessage & "</td><td>" & FormatNumber(CDbl(oRow("Quantity")) * CDbl(oRow("Price")) * CDbl(oRow("Multiplier")),2) & _
					"</td><td>" & CDbl(oRow("Quantity")) * CDbl(oRow("Weight")) & "</td></tr>"
			Next
			cMessage = cMessage & "<tr><td colspan=6 align=right>&nbsp;</td></tr>"
			cMessage = cMessage & "<tr><td colspan=4 align=right><b>Subtotal:</b> </td><td>" & FormatCurrency(nTotal,2) & "</td></tr>"
			cMessage = cMessage & "<tr><td colspan=4 align=right><b>Weight:</b> </td><td>" & FormatNumber(nWeight,2) & " lbs</td></tr>"
			cMessage = cMessage & "<tr><td colspan=4 align=right><b>Shipping & Handling:</b> </td><td>" & FormatCurrency(nWeight * 0.20,2) & "</td></tr>"
			cMessage = cMessage & "<tr><td colspan=4 align=right><b>Total:</b> </td><td>" & FormatCurrency(nTotal + (nWeight * 0.20),2) & "</td></tr>"
			cMessage = cMessage & "</table></body></html>"

			Set cdoConfig = CreateObject("CDO.Configuration")
			sch = "http://schemas.microsoft.com/cdo/configuration/"
			With cdoConfig.Fields
		        .Item(sch & "sendusing") = 2
		        .Item(sch & "smtpserver") = "smtp.sendgrid.net"
		        .Item(sch & "smtpserverport") = 25
		        .Item(sch & "smtpauthenticate") = 1
		        .Item(sch & "sendusername") = "qxpress@marathondata.com"
		        .Item(sch & "sendpassword") = "QXpr3ss"
				.update
			End With

			Set cdoMessage = CreateObject("CDO.Message")

			With cdoMessage
				Set .Configuration = cdoConfig
				.From = "Diane Mellon<goldiggers@comcast.net>"
				.To = cEmail
				.Subject = "OMAs Pride Order Confirmation"
				.HTMLBody = cMessage
				.Send
			End With

			Set cdoMessage = Nothing
			Set cdoConfig = Nothing

			Response.Write "Sent to: " & cEmail & "<br>"
			%>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>
</body>
</html>
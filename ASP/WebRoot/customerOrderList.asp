<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckAdminLogin

cMode = Request("Mode")
cUserID = Session("UserID")

Set objOrder = Server.CreateObject("Omas.Orders")
Set oOrder = objOrder.LoadUserBatch("", "")
Call CheckDictError(oOrder)
%>
<html>
<head>

<title>OMA's Pride Ordering System</title>
<link rel="stylesheet" type="text/css" href="styles.css">

<style type="text/css">
BODY, TD {
	font-family: Arial;
	font-size: 12px;
	border-bottom: black 1px solid;
}

TH {
	font-family: Arial;
	font-size: 12px;
	border-bottom: black 1px solid;
	font-weight: bold;
	text-align: left;	
}

TR {
	height: 20px;
	line-height: 20px;	
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
.line {
	border-bottom: black 1px solid;
}
</style>

</head>
<body>

<div style="height: 480px; width: 750px;">
<table width=750 border=0 cellpadding=2 cellspacing=0>
<tr>
	<th>Pickup</th>
	<th>Name</th>
	<th>Phone</th>
	<th>Weight</th>
	<th>Total</th>
</tr>
<%
nPage = 0
cCustomerName = ""
cPhone = ""
nTotal = 0
nWeight = 0
lFirst = True
For Each oItem in oOrder
	Set oRow = oOrder(oItem)
	If lFirst Then 
		cCustomerName = oRow("CustomerName")
		cPhone = oRow("Phone")
		lFirst = False
	End If
	If cCustomerName <> oRow("CustomerName") Then
		If nTotal > 0 Then
			%>
			<tr>
				<td>[ &nbsp; &nbsp;] &nbsp;</td>
				<td><%=cCustomerName%></td>
				<td><%=cPhone%></td>
				<td><%=FormatNumber(nWeight,2)%> lbs</td>
				<td><%=FormatCurrency(nTotal + (nWeight * 0.20),2)%></td>
			</tr>
			<%
			cCustomerName = oRow("CustomerName")
			cPhone = oRow("Phone")
		End If
		nTotal = 0
		nWeight = 0
	End If

	nOdd = 1 - nOdd
	nTotal = CDbl(nTotal) + (CDbl(oRow("Quantity")) * CDbl(oRow("Price")) * CDbl(oRow("Multiplier")))
	nWeight = CDbl(nWeight) + (CDbl(oRow("Quantity")) * CDbl(oRow("Weight")))
Next
%>
<tr>
	<td>[ &nbsp; &nbsp;] &nbsp;</td>
	<td><%=cCustomerName%></td>
	<td><%=cPhone%></td>
	<td><%=FormatNumber(nWeight,2)%> lbs</td>
	<td><%=FormatCurrency(nTotal + (nWeight * 0.20),2)%></td>
</tr>
</table>
</body>
</html>
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
<%
nPage = 0
cCustomerName = ""
nTotal = 0
nWeight = 0
For Each oItem in oOrder
	Set oRow = oOrder(oItem)
	If cCustomerName <> oRow("CustomerName") Then
		cCustomerName = oRow("CustomerName")
		If nTotal > 0 Then
			%>
			<tr>
				<td colspan=5 align=right>Subtotal: &nbsp; </td>
				<td><%=FormatCurrency(nTotal,2)%></td>
			</tr>
			<tr>
				<td colspan=5 align=right>Weight: &nbsp; </td>
				<td><%=FormatNumber(nWeight,2)%> lbs</td>
			</tr>
			<tr>
				<td colspan=5 align=right>Shipping & Handling: &nbsp; </td>
				<td><%=FormatCurrency(nWeight * 0.20,2)%></td>
			</tr>
			<tr>
				<td colspan=5 align=right>Total: &nbsp; </td>
				<td><%=FormatCurrency(nTotal + (nWeight * 0.20),2)%></td>
			</tr>
			</table>
			</div>
			<%
			If nPage = 1 Then
				%>
				<div style='page-break-after: always;'>&nbsp;</div>
				<%
			End If
			nPage = 1 - nPage
			%>
			<div style="height: 480px; width: 750px;">
			<table width=750 border=0 cellpadding=2 cellspacing=0>
			<%
		End If
		%>
		<tr><td colspan=6>
			&nbsp;
			<p>
			<b><%=cCustomerName & " &nbsp; &nbsp; &nbsp; " & oRow("Phone") & " &nbsp; &nbsp; &nbsp; " & oRow("Email") %></b>
			<p>
		</td></tr>
		<tr class="secheader">
			<td width=50 class="secheader">SKU</td>
			<td width=50 class="secheader">Qty</td>
			<td width="*" class="secheader">Description</td>
			<td width=80 class="secheader">Price</td>
			<td width=50 class="secheader">Qty</td>
			<td width=80 class="secheader">Total</td>
			<td width=50 class="secheader">Lbs</td>
			
		</tr>
		<%
		nTotal = 0
		nWeight = 0
	End If

	nOdd = 1 - nOdd
	nTotal = CDbl(nTotal) + (CDbl(oRow("Quantity")) * CDbl(oRow("Price")) * CDbl(oRow("Multiplier")))
	nWeight = CDbl(nWeight) + (CDbl(oRow("Quantity")) * CDbl(oRow("Weight")))
	If CDbl(oRow("Multiplier")) <> 1.0 Then lDisclaimer = True
	%>
	<tr>
		<td class="line"><%=oRow("SKU")%>
		<td class="line"><%=oRow("Quantity")%>
		<td class="line"><%=oRow("Name")%>
		<td class="line"><%=FormatNumber(oRow("Price"),2)%> / <%=oRow("PricePer")%></td>
		<td class="line"><%=oRow("Quantity")%>
		<% If oRow("OrderPer") <> "ea" Then Response.Write "&nbsp;" & oRow("OrderPer") %>
		</td>
		<td class="line"><%=FormatNumber(CDbl(oRow("Quantity")) * CDbl(oRow("Price")) * CDbl(oRow("Multiplier")),2)%></td>
		<td class="line"><%=CDbl(oRow("Quantity")) * CDbl(oRow("Weight"))%></td>
	</tr>
	<%
Next
%>
<tr>
	<td colspan=5 align=right>Subtotal: &nbsp; </td>
	<td><%=FormatCurrency(nTotal,2)%></td>
</tr>
<tr>
	<td colspan=5 align=right>Weight: &nbsp; </td>
	<td><%=FormatNumber(nWeight,2)%> lbs</td>
</tr>
<tr>
	<td colspan=5 align=right>Shipping & Handling: &nbsp; </td>
	<td><%=FormatCurrency(nWeight * 0.20,2)%></td>
</tr>
<tr>
	<td colspan=5 align=right>&nbsp;</td>
	<td><%=FormatCurrency(nTotal + (nWeight * 0.20),2)%></td>
</tr>
</table>
</div>

</body>
</html>
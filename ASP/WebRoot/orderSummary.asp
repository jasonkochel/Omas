<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckLogin

cMode = Request("Mode")
cUserID = Session("UserID")

Set objOrder = Server.CreateObject("Omas.Orders")
Set oOrder = objOrder.LoadUserBatch(cUserID, "")
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
</style>

</head>
<body>

<table width="761" border=0 cellspacing=0 cellpadding=0>
<tr>
	<td class="font-content" valign="top" align=center>
		<span class="headerlargegreen"><b>OMA's Pride Ordering System</b></span><br>
		<p>
		<div class="headermediumblue">Your order is shown below
		<p>
		<a href="orderForm.asp">Modify My Order</a>
		<p>
		<a href="menu.asp">Back to Main Menu</a>	
		</div>
		<br>
		<TABLE WIDTH="750" BORDER="0" CELLSPACING="0" CELLPADDING="0">
		<tr>
			<td align=center>

			<table width=750 border=0 cellpadding=2 cellspacing=0>
				<tr class="secheader">
					<td width=50 class="secheader">SKU</td>
					<td width="*" class="secheader">Description</td>
					<td width=80 class="secheader">Price</td>
					<td width=50 class="secheader">Qty</td>
					<td width=80 class="secheader">Total</td>
					<td width=50 class="secheader">Lbs</td>
				</tr>
				<%
				nTotal = 0
				nWeight = 0
				lDisclaimer = False
				For Each oItem in oOrder
					Set oRow = oOrder(oItem)
					nOdd = 1 - nOdd
					If nOdd = 0 Then cRowClass = "shadedrow" Else cRowClass = ""
					nTotal = CDbl(nTotal) + (CDbl(oRow("Quantity")) * CDbl(oRow("Price")) * CDbl(oRow("Multiplier")))
					nWeight = CDbl(nWeight) + (CDbl(oRow("Quantity")) * CDbl(oRow("Weight")))
					If CDbl(oRow("Multiplier")) <> 1.0 Then lDisclaimer = True
					%>
					<tr class="<%=cRowClass%>">
						<td><%=oRow("SKU")%>
						<td><%=oRow("Name")%>
						<td><%=FormatNumber(oRow("Price"),2)%> / <%=oRow("PricePer")%></td>
						<td><%=oRow("Quantity")%>
						<% If oRow("OrderPer") <> "ea" Then Response.Write "&nbsp;" & oRow("OrderPer") %>
						</td>
						<td><%=FormatNumber(CDbl(oRow("Quantity")) * CDbl(oRow("Price")) * CDbl(oRow("Multiplier")),2)%>
						<% If CDbl(oRow("Multiplier")) <> 1.0 Then Response.Write " &nbsp; <span style='color: red'>**</span>" %>
						</td>
						<td><%=CDbl(oRow("Quantity")) * CDbl(oRow("Weight"))%></td>
					</tr>
					<%
				Next
				%>
				<tr>
					<td style="border-top: black 1px solid;" colspan=4 align=right>Subtotal: &nbsp; </td>
					<td style="border-top: black 1px solid;" colspan=2><%=FormatCurrency(nTotal,2)%></td>
				</tr>
				<tr>
					<td colspan=4 align=right>Weight: &nbsp; </td>
					<td><%=FormatNumber(nWeight,2)%> lbs</td>
				</tr>
				<tr>
					<td colspan=4 align=right>Shipping & Handling: &nbsp; </td>
					<td><%=FormatCurrency(nWeight * 0.20,2)%></td>
				</tr>
				<tr>
					<td colspan=4 align=right>&nbsp;</td>
					<td><%=FormatCurrency(nTotal + (nWeight * 0.20),2)%></td>
				</tr>
			</table>
			<p>
			<%
			If lDisclaimer Then
				%>
				<span style="color: red">
				** This item is priced by one unit of measure, but ordered by another.  For example, it may be
				priced per-pound but ordered per-piece.<br>The actual weight of the item, and thus the total price,
				may change once the order is placed.
				</span>
				<%
			End If
			%>			
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>
</body>
</html>
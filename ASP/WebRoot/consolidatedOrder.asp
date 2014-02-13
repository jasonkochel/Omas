<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckAdminLogin

cMode = Request("Mode")
cUserID = Session("UserID")
cBatchID = Session("BatchID")

Set objOrder = Server.CreateObject("Omas.Orders")
Set oOrder = objOrder.LoadConsolidatedOrder(cBatchID)
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

<table width="750" border=0 cellspacing=0 cellpadding=0>
<tr>
	<td class="font-content" valign="top" align=center>
		<span class="headerlargegreen"><b>OMA's Pride Ordering System</b></span><br>
		<p>
		<TABLE WIDTH="750" BORDER="0" CELLSPACING="0" CELLPADDING="0">
		<tr>
			<td align=center>

			<table width=750 border=0 cellpadding=2 cellspacing=0>
				<tr class="secheader">
					<td width=100 class="secheader">SKU</td>
					<td width="*" class="secheader">Item</td>
					<td width=100 class="secheader">Quantity</td>
					<td width=150 class="secheader">Total Price</td>
				</tr>
				<%
				nTotal = 0
				For Each oItem in oOrder
					Set oRow = oOrder(oItem)
					nOdd = 1 - nOdd
					If nOdd = 0 Then cRowClass = "shadedrow" Else cRowClass = ""
					nTotal = CDbl(nTotal) + CDbl(oRow("TotalPrice"))
					%>
					<tr class="<%=cRowClass%>">
						<td><%=oRow("SKU")%>
						<td><%=oRow("Name")%>
						<td><%=oRow("TotalQuantity")%></td>
						<td><%=FormatNumber(oRow("TotalPrice"),2)%>
						</td>
					</tr>
					<%
				Next
				%>
				<tr>
					<td class="headersmallblue" style="border-top: black 1px solid;" colspan=3>Total: &nbsp;</td>
					<td class="headersmallblue" style="border-top: black 1px solid;" ><%=FormatNumber(nTotal,2)%></td>
				</tr>
			</table>
			</td>
		</tr>
		</table>
	</td>
</tr>
</table>
</body>
</html>
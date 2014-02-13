<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckLogin

cMode = Request("Mode")
cUserID = Session("UserID")

If cMode = "Submit" Then
	Set oFields = Server.CreateObject("Scripting.Dictionary")
	
	For Each oItem in Request.Form
		oFields(oItem) = Request.Form(oItem)
	Next
	
	Set objOrder = Server.CreateObject("Omas.Orders")
	cOK = objOrder.Save(cUserID, oFields)
	Call CheckError(cOK)
	Response.Redirect "orderSummary.asp"
End If

Set objCatalog = Server.CreateObject("Omas.Catalog")
Set oCatalog = objCatalog.GetAll()
Call CheckRSError(oCatalog)

Set objOrder = Server.CreateObject("Omas.Orders")
Set oOrder = objOrder.LoadUserBatch(cUserID, "")
Call CheckDictError(oOrder)

Set oBatch = objOrder.LoadBatch(Session("BatchID"))
cOrderDate = oBatch("OrderDate")
Set objOrder = Nothing

Set objUser = Server.CreateObject("Omas.Users")
Set oUser = objUser.Load(cUserID)
Set objUser = Nothing
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

<script type="text/javascript">
function SubmitOrder() {
	var cOK = window.confirm("By clicking Submit, you are committing to ordering this food.  Continue?")
	if (cOK)
		document.frmOrder.submit();
}
</script>

</head>
<body>
<table width="761" border=0 cellspacing=0 cellpadding=0>
<tr>
	<td class="font-content" valign="top" align=center>
		<span class="headerlargegreen">
		<b>OMA's Pride Ordering System</b></span><br>
		<p>
		<div class="headermediumblue">Please enter the quantity of each item that you would like to order, 
		then click the "Submit" button at the bottom of the page.  Once you submit your order, you
		will be shown a summary and price total.  You can return to edit your order at any time until <%=cOrderDate%>.</div>
		<p>
		<div class="headermediumred">
		<b>PLEASE LIMIT YOUR ORDER TO NO MORE THAN 15 DIFFERENT ITEMS</b>
		</div>
		<br>
		<TABLE WIDTH="750" BORDER="0" CELLSPACING="0" CELLPADDING="0">
		<tr>
			<td align=center>

			<form name="frmOrder" method="POST" action="orderForm.asp?Mode=Submit">
			<table border=0 cellpadding=1 cellspacing=0>
				<%
				lLastHeader = False
				Do Until oCatalog.EOF
					If Em(oCatalog("SKU")) Then
						lLastHeader = True
						%>
						<tr class="secheader">
							<td class="secheader" colspan=4><%=oCatalog("Name")%></td>
						</tr>
						<%
					Else
						If lLastHeader Then
							lLastHeader = False
							%>
							<tr class="colheader">
								<td width=50 class="colheader">SKU</td>
								<td width="*" class="colheader">Item</td>
								<td width="100" class="colheader">Price</td>
								<td width="100" class="colheader">Your Order</td>
							</tr>
							<%
						End If
						
						nOdd = 1 - nOdd
						If nOdd = 0 Then cRowClass = "shadedrow" Else cRowClass = ""
						If oOrder.Exists(CStr(oCatalog("CatalogID")) & "|" & cUserID) Then
							cQty = oOrder(CStr(oCatalog("CatalogID")) & "|" & cUserID)("Quantity")
						Else
							cQty = ""
						End If
						%>
						<tr class="<%=cRowClass%>">
							<td><%=oCatalog("SKU")%></td>
							<td><%=oCatalog("Name")%>
							<td><%=FormatNumber(oCatalog("Price"),2)%> / <%=oCatalog("PricePer")%></td>
							<td><input type=text name="Qty<%=oCatalog("CatalogID")%>" size=5 maxlength=5 value="<%=cQty%>"> <%=oCatalog("OrderPer")%></td>
						</tr>
						<%
					End If
					oCatalog.MoveNext
				Loop
				%>
			</table>
			<INPUT TYPE="Button" Name="Submit" Value="Submit" onClick="javascript: SubmitOrder();">		
			</form>
</body>
</html>
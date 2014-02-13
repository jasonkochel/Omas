<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckAdminLogin

cMode = Request("Mode")
cUserID = Session("UserID")

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
		<p>
		<div class="headermediumblue">
		<%
		If oBatch("IsOpen") Then
			%>
			Ordering is currently OPEN
			<br>
			Orders are due by <%=oBatch("OrderDate")%>, delivery is on <%=oBatch("DeliveryDate")%>
			<p>
			<a href="closeOrdering.asp">Close Ordering</a>
			<p>&nbsp;
			<%
		Else
			%>
			Ordering is currently CLOSED
			<br>
			Delivery is on <%=oBatch("DeliveryDate")%>
			<p>
			<b>First:</b> <a href="/app/index.html">Edit Catalog</a>
			<p>
			Then: <a href="openOrdering.asp">Open Ordering</a>
			<p>&nbsp;
			<%
		End If
		%>
		<p>
		<a href="consolidatedOrder.asp">Consolidated Order Form</a>
		<p>
		<a href="adminForgotPassword.asp">Retrieve A Password</a>
		<p>
		<a href="customerReceipts.asp">Print Customer Receipts</a>
		<p>
		<a href="emailReceiptsConf.asp">E-Mail Customer Receipts</a>
		<p>
		<a href="customerOrderList.asp">Customer Checklist</a>
		<p>&nbsp;<p>
		<a href="menu.asp">Back to Main Menu</a>
		</div>
	</td>
</tr>
</table>
</body>
</html>
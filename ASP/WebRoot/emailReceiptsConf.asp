<!-- #INCLUDE VIRTUAL="/functions.asp" -->
<%
Call CheckAdminLogin

cMode = Request("Mode")
cUserID = Session("UserID")
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
		You are about to send e-mails to everyone who ordered.  If you want to proceed, click below.
		<p>
		<a href="emailReceipts.asp">E-Mail Customer Receipts</a>
		</div>
	</td>
</tr>
</table>
</body>
</html>
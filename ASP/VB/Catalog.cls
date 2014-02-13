VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "Catalog"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
Option Explicit
Implements ObjectControl
Dim oContext As ObjectContext

Private Function ObjectControl_CanBePooled() As Boolean
    ObjectControl_CanBePooled = True
End Function

Private Sub ObjectControl_Deactivate()
    Set oContext = Nothing
End Sub

Private Sub ObjectControl_Activate()
    Set oContext = GetObjectContext()
End Sub

Public Function Insert() As String
    On Error GoTo Err
    
    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    
    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")
    
    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "CatalogInsert"
    cm.Parameters.Refresh
    
    cm("@") = 0
    
    cm.Execute
    
    Insert = CStr(cm("@"))
    
    cn.Close
    Set cm = Nothing
    Set cn = Nothing
    
    oContext.SetComplete
    Exit Function
    
Err:
    oContext.SetAbort
    
    CloseCn cn
    Set cm = Nothing
    Set cn = Nothing
    
    Insert = "ERR: " & Err.Description & " in " & Err.Source
    
End Function

Public Function GetAll() As ADODB.Recordset
    On Error GoTo Err
    
    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    Dim rs As ADODB.Recordset
    
    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")
    Set rs = oContext.CreateInstance("ADODB.Recordset")
    
    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "CatalogSelectAll"
    
    rs.CursorLocation = adUseClient
    rs.Open cm
    rs.ActiveConnection = Nothing
          
    Set GetAll = rs
          
    cn.Close
    Set rs = Nothing
    Set cm = Nothing
    Set cn = Nothing
    
    oContext.SetComplete
    Exit Function
    
Err:
    oContext.SetAbort
          
    CloseRs rs
    CloseCn cn
    Set cm = Nothing
    Set cn = Nothing
    Set rs = Nothing
          
    Set GetAll = GetRSError()
End Function
    
Public Function Load(ByVal c As String) As Scripting.Dictionary
    On Error GoTo Err
    
    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    Dim rs As ADODB.Recordset
    Dim oField As ADODB.Field
    Dim oResults As New Scripting.Dictionary
    
    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")
    
    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "CatalogSelect"
    cm.Parameters.Refresh
    
    cm("@") = CDbl(c)
    
    Set rs = cm.Execute
    
    If Not rs.EOF Then
        For Each oField In rs.Fields
            oResults.Add oField.Name, oField.Value
        Next
    End If
    
    Set Load = oResults
    Set oResults = Nothing
    
    rs.Close
    cn.Close
    Set rs = Nothing
    Set cm = Nothing
    Set cn = Nothing
    
    oContext.SetComplete
    Exit Function
    
Err:
    oContext.SetAbort
    
    CloseRs rs
    CloseCn cn
    Set rs = Nothing
    Set cm = Nothing
    Set cn = Nothing
    
    oResults.Add "ERR", Err.Description & " in " & Err.Source
    Set Load = oResults
    Set oResults = Nothing
    
End Function

Public Function Save(ByVal c As String, _
                     ByVal oFields As Scripting.Dictionary) As String
    On Error GoTo Err
    
    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    
    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")
    
    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "CatalogUpdate"
    cm.Parameters.Refresh
    
    cm("@CatalogID") = CDbl(oFields("CatalogID"))
    cm("@Name") = Left(oFields("Name"), 200)
    cm("@SKU") = Left(oFields("SKU"), 10)
    cm("@OrderPer") = Left(oFields("OrderPer"), 10)
    cm("@PricePer") = Left(oFields("PricePer"), 50)
    cm("@Price") = CDbl(oFields("Price"))
    
    cm.Execute
    
    Save = "OK"
    
    cn.Close
    Set cm = Nothing
    Set cn = Nothing
    
    oContext.SetComplete
    Exit Function
    
Err:
    oContext.SetAbort
    
    CloseCn cn
    Set cm = Nothing
    Set cn = Nothing
    
    Save = "ERR: " & Err.Description & " in " & Err.Source
    
End Function

Public Function Delete(ByVal c As String) As String
    On Error GoTo Err
    
    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    
    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")
    
    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "CatalogDelete"
    cm.Parameters.Refresh
    
    cm("@") = CDbl(c)
    
    cm.Execute
    
    Delete = "OK"
    
    cn.Close
    Set cm = Nothing
    Set cn = Nothing
    
    oContext.SetComplete
    Exit Function
    
Err:
    oContext.SetAbort
    
    CloseCn cn
    Set cm = Nothing
    Set cn = Nothing
    
    Delete = "ERR: " & Err.Description & " in " & Err.Source
    
End Function




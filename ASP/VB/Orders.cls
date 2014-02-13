VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 3  'UsesTransaction
END
Attribute VB_Name = "Orders"
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

Public Function Insert(ByVal cUserID As String) As String
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "OrderInsert"
        cm.Parameters.Refresh
        

        cm("@UserID") = CDbl(cUserID)
        cm("@OrderID") = 0
        cm.Execute

        Insert = CStr(cm("@OrderID"))

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

        Insert = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl

End Function

Public Function InsertBatch(ByVal cOrderDate As String, ByVal cDeliveryDate) As String
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "OrderBatchOpenNew"
        cm.Parameters.Refresh
        
        cm("@OrderDate") = CDate(cOrderDate)
        cm("@DeliveryDate") = CDate(cDeliveryDate)
        cm.Execute

        InsertBatch = "OK"

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

        InsertBatch = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl

End Function

Public Function Save(ByVal cUserID As String, _
                     ByVal oFields As Scripting.Dictionary) As String
    On Error GoTo Err

    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    Dim oItem As Variant

    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")

    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "OrderDeleteUserBatch"
    cm.Parameters.Refresh
    cm("@UserID") = CDbl(cUserID)
    cm.Execute
    
    cm.CommandText = "OrderInsert"
    cm.Parameters.Refresh
    cm("@UserID") = CDbl(cUserID)
    For Each oItem In oFields
        If Left(oItem, 3) = "Qty" Then
            cm("@CatalogID") = Mid(oItem, 4, 10)
            If IsNumeric(oFields(oItem)) Then
                cm("@Quantity") = CDbl(oFields(oItem))
                cm.Execute
            End If
        End If
    Next
    
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

    Save = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl
End Function

Public Function Load(ByVal cOrderID As String) As Scripting.Dictionary
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
        cm.CommandText = "OrderSelect"
        cm.Parameters.Refresh

        cm("@OrderID") = CDbl(cOrderID)

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

        oResults.Add "ERR", Err.Description & " in " & Err.Source & " line: " & Erl
        Set Load = oResults
        Set oResults = Nothing

End Function

Public Function LoadToday(ByVal cToday As String) As Scripting.Dictionary
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command
        Dim rs As ADODB.Recordset
        Dim oField As ADODB.Field
        Dim oResults As New Scripting.Dictionary
        Dim oRow As Scripting.Dictionary
        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "OrderSelectToday"
        cm.Parameters.Refresh

        cm("@AddDate") = CDate(cToday)

        Set rs = cm.Execute

'          If Not rs.EOF Then
'                  For Each oField In rs.Fields
'                           oResults.Add oField.Name, oField.Value
'                   Next
'           End If

      Do Until rs.EOF
              Set oRow = oContext.CreateInstance("Scripting.Dictionary")
              For Each oField In rs.Fields
                      oRow.Add oField.Name, oField.Value
              Next
              oResults.Add CStr(rs("OrderID")), oRow
              Set oRow = Nothing
              rs.MoveNext
      Loop

        Set LoadToday = oResults
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

        oResults.Add "ERR", Err.Description & " in " & Err.Source & " line: " & Erl
        Set LoadToday = oResults
        Set oResults = Nothing

End Function

Public Function LoadUserBatch(ByVal cUserID As String, cBatchID As String) As Scripting.Dictionary
    On Error GoTo Err
    
    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    Dim rs As ADODB.Recordset
    Dim oField As ADODB.Field
    Dim oResults As New Scripting.Dictionary
    Dim oRow As Scripting.Dictionary
    
    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")
    
    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "OrderSelectUserBatch"
    cm.Parameters.Refresh
    
    If Em(cUserID) Then
        cm("@UserID") = Null
    Else
        cm("@UserID") = CDbl(cUserID)
    End If
    
    If Em(cBatchID) Then
        cm("@BatchID") = Null
    Else
        cm("@BatchID") = CDbl(cBatchID)
    End If
    
    Set rs = cm.Execute

    Do Until rs.EOF
        Set oRow = oContext.CreateInstance("Scripting.Dictionary")
        For Each oField In rs.Fields
            oRow.Add oField.Name, oField.Value
        Next
        oResults.Add CStr(rs("CatalogID")) & "|" & CStr(rs("UserID")), oRow
        Set oRow = Nothing
        rs.MoveNext
    Loop

    Set LoadUserBatch = oResults
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

    oResults.Add "ERR", Err.Description & " in " & Err.Source & " line: " & Erl
    Set LoadUserBatch = oResults
    Set oResults = Nothing

End Function
Public Function Delete(ByVal cUserID As String, _
                        ByVal cRestaurantID As String, _
                        ByVal cOrderDate As Date) As String
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "OrderDelete"
        cm.Parameters.Refresh

        cm("@UserID") = CDbl(cUserID)
        cm("@RestaurantID") = CDbl(cRestaurantID)
        cm("@OrderDate") = CDate(cOrderDate)

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

        Delete = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl

End Function

Public Function InsertHistory() As String
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "OrderHistoryInsert"
        cm.Parameters.Refresh
        
        cm("@OrderHistoryID") = 0
        
        cm.Execute

        InsertHistory = CStr(cm("@OrderHistoryID"))

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

        InsertHistory = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl

End Function

Public Function LoadHistory(ByVal cToday As String) As Scripting.Dictionary
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
        cm.CommandText = "OrderHistoryLoad"
        cm.Parameters.Refresh

        cm("@AddDate") = CDate(cToday)

        Set rs = cm.Execute

        If Not rs.EOF Then
                For Each oField In rs.Fields
                        oResults.Add oField.Name, oField.Value
                Next
        End If

        Set LoadHistory = oResults
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

        oResults.Add "ERR", Err.Description & " in " & Err.Source & " line: " & Erl
        Set LoadHistory = oResults
        Set oResults = Nothing

End Function

Public Function DeleteGuest(ByVal cUserID As String, _
                        ByVal cRestaurantID As String, _
                        ByVal cOrderDate As Date, _
                        ByVal cGuestName As String) As String
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "OrderDeleteGuest"
        cm.Parameters.Refresh

        cm("@UserID") = CDbl(0)
        cm("@RestaurantID") = CDbl(cRestaurantID)
        cm("@OrderDate") = CDate(cOrderDate)
        cm("@GuestName") = cGuestName

        cm.Execute

        DeleteGuest = "OK"

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

        DeleteGuest = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl

End Function

Public Function LoadGuestDate(ByVal cUserID As String, _
                            ByVal cToday As Date, _
                            ByVal cGuestName As String) As Scripting.Dictionary
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command
        Dim rs As ADODB.Recordset
        Dim oField As ADODB.Field
          Dim oResults As New Scripting.Dictionary
          Dim oRow As Scripting.Dictionary

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "OrderGuestDate"
        cm.Parameters.Refresh

        cm("@Date") = CDate(cToday)
        cm("@UserID") = CDbl(cUserID)
        cm("@GuestName") = cGuestName

        Set rs = cm.Execute

  Do Until rs.EOF
          Set oRow = oContext.CreateInstance("Scripting.Dictionary")
          For Each oField In rs.Fields
                  oRow.Add oField.Name, oField.Value
          Next
          oResults.Add CStr(rs("OrderID")), oRow
          Set oRow = Nothing
          rs.MoveNext
  Loop

        Set LoadGuestDate = oResults
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

        oResults.Add "ERR", Err.Description & " in " & Err.Source & " line: " & Erl
        Set LoadGuestDate = oResults
        Set oResults = Nothing

End Function

Public Function LoadBatch(ByVal cBatchID As String) As Scripting.Dictionary
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
    cm.CommandText = "OrderBatchSelect"
    cm.Parameters.Refresh
    
    cm("@BatchID") = CDbl(cBatchID)
    
    Set rs = cm.Execute

    If Not rs.EOF Then
        For Each oField In rs.Fields
            oResults.Add oField.Name, oField.Value
        Next
    End If

    Set LoadBatch = oResults
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

    oResults.Add "ERR", Err.Description & " in " & Err.Source & " line: " & Erl
    Set LoadBatch = oResults
    Set oResults = Nothing

End Function

Public Function CloseBatch(ByVal cBatchID As String) As String
    On Error GoTo Err
    
    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    
    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")
    
    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "OrderBatchClose"
    cm.Parameters.Refresh
    
    cm("@BatchID") = CDbl(cBatchID)
    
    cm.Execute

    CloseBatch = "OK"
    
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

    CloseBatch = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl

End Function

Public Function GetCurrentBatch() As String
    On Error GoTo Err
    
    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    
    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")
    
    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "OrderBatchSelectCurrent"
    cm.Parameters.Refresh
    
    cm("@BatchID") = 0
    
    cm.Execute

    GetCurrentBatch = CStr(cm("@BatchID"))

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

    GetCurrentBatch = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl

End Function

Public Function LoadConsolidatedOrder(ByVal cBatchID As String) As Scripting.Dictionary
    On Error GoTo Err
    
    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command
    Dim rs As ADODB.Recordset
    Dim oField As ADODB.Field
    Dim oResults As New Scripting.Dictionary
    Dim oRow As Scripting.Dictionary
    
    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")
    
    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "OrderSelectConsolidated"
    cm.Parameters.Refresh
    
    cm("@BatchID") = CDbl(cBatchID)
    
    Set rs = cm.Execute

    Do Until rs.EOF
        Set oRow = oContext.CreateInstance("Scripting.Dictionary")
        For Each oField In rs.Fields
            oRow.Add oField.Name, oField.Value
        Next
        oResults.Add CStr(rs("CatalogID")), oRow
        Set oRow = Nothing
        rs.MoveNext
    Loop

    Set LoadConsolidatedOrder = oResults
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

    oResults.Add "ERR", Err.Description & " in " & Err.Source & " line: " & Erl
    Set LoadConsolidatedOrder = oResults
    Set oResults = Nothing

End Function


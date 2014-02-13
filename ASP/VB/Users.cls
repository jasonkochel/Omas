VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 3  'UsesTransaction
END
Attribute VB_Name = "Users"
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
        cm.CommandText = "UserInsert"
        cm.Parameters.Refresh
        
        cm("@UserID") = 0

        cm.Execute

        Insert = CStr(cm("@UserID"))

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

Public Function Save(ByVal cUserID As String, _
                     ByVal oFields As Scripting.Dictionary) As String
    On Error GoTo Err

    Dim cn As ADODB.Connection
    Dim cm As ADODB.Command

    Set cn = oContext.CreateInstance("ADODB.Connection")
    Set cm = oContext.CreateInstance("ADODB.Command")

    Connect cn
    cm.ActiveConnection = cn
    cm.CommandType = adCmdStoredProc
    cm.CommandText = "UserUpdate"
    cm.Parameters.Refresh

    cm("@UserID") = CDbl(cUserID)
    cm("@FName") = Left(oFields("FName"), 30)
    cm("@LName") = Left(oFields("LName"), 30)
    cm("@Password") = Left(oFields("Password"), 20)
    cm("@Email") = Left(oFields("Email"), 50)
    cm("@Phone") = Left(oFields("Phone"), 20)

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

    Save = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl

End Function

Public Function Login(ByVal cEmail As String, _
                      ByVal cPassword As String) As Scripting.Dictionary

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
    cm.CommandText = "UserLogin"
    cm.Parameters.Refresh
    
    cm("@Email") = Left(Trim(cEmail), 50)
    cm("@Password") = Left(Trim(cPassword), 20)
    
    Set rs = cm.Execute
    
    If Not rs.EOF Then
        For Each oField In rs.Fields
            oResults.Add oField.Name, oField.Value
        Next
    End If
    
    Set Login = oResults
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
    Set Login = oResults
    Set oResults = Nothing
    
End Function

Public Function LoadByEmail(ByVal cEmail As String) As Scripting.Dictionary

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
    cm.CommandText = "UserLoadByEmail"
    cm.Parameters.Refresh
    
    cm("@Email") = Left(Trim(cEmail), 50)
   
    Set rs = cm.Execute

    Do Until rs.EOF
        Set oRow = oContext.CreateInstance("Scripting.Dictionary")
        For Each oField In rs.Fields
            oRow.Add oField.Name, oField.Value
        Next
        oResults.Add CStr(rs("UserID")), oRow
        Set oRow = Nothing
        rs.MoveNext
    Loop
    
    Set LoadByEmail = oResults
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
    Set LoadByEmail = oResults
    Set oResults = Nothing
    
End Function

Public Function LoadReminder() As Scripting.Dictionary

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
    cm.CommandText = "UserLoadReminder"
    cm.Parameters.Refresh
    
    Set rs = cm.Execute
    

  Do Until rs.EOF
          Set oRow = oContext.CreateInstance("Scripting.Dictionary")
          For Each oField In rs.Fields
                  oRow.Add oField.Name, oField.Value
          Next
          oResults.Add CStr(rs("Name")), oRow
          Set oRow = Nothing
          rs.MoveNext
  Loop
    
    Set LoadReminder = oResults
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
    Set LoadReminder = oResults
    Set oResults = Nothing
    
End Function


Public Function ReminderSentInsert(ByVal cUserID As String) As String
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "ReminderSentInsert"
        cm.Parameters.Refresh
        
        cm("@ReminderID") = 0
        cm("@UserID") = CDbl(cUserID)

        cm.Execute

        ReminderSentInsert = CStr(cm("@UserID"))

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

        ReminderSentInsert = "ERR: " & Err.Description & " in " & Err.Source & " line: " & Erl

End Function

Public Function Load(ByVal cUserID As String) As Scripting.Dictionary
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
        cm.CommandText = "UserSelect"
        cm.Parameters.Refresh

        cm("@UserID") = CDbl(cUserID)

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

Public Function Delete(ByVal cUserID As String) As String
        On Error GoTo Err

        Dim cn As ADODB.Connection
        Dim cm As ADODB.Command

        Set cn = oContext.CreateInstance("ADODB.Connection")
        Set cm = oContext.CreateInstance("ADODB.Command")

        Connect cn
        cm.ActiveConnection = cn
        cm.CommandType = adCmdStoredProc
        cm.CommandText = "UserDelete"
        cm.Parameters.Refresh

        cm("@UserID") = CDbl(cUserID)

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


function Legend(){

  return(

    <div
      style={{
        position: "absolute",
        bottom: "30px",
        left: "30px",
        background: "white",
        padding: "10px",
        borderRadius: "6px",
        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
        fontSize: "13px",
        zIndex: 1000
      }}
    >

      <b>Priority Legend</b>

      <div>
        <span style={{color:"green"}}>■</span> Low Priority
      </div>

      <div>
        <span style={{color:"orange"}}>■</span> Medium Priority
      </div>

      <div>
        <span style={{color:"red"}}>■</span> High Priority
      </div>

    </div>

  );

}

export default Legend;
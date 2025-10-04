// dto/ResultsDto.java
package com.f1prognosis.backend.dto;

import com.f1prognosis.backend.model.GrandPrixResult;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResultsDto {
    private Long grandPrixId;
    private String grandPrixName;
    private String circuit;
    private String polePositionDriver;
    private String p1Driver;
    private String p2Driver;
    private String p3Driver;
    private String fastestLapDriver;

    public ResultsDto() {}

    public ResultsDto(GrandPrixResult result) {
        this.grandPrixId = result.getGrandPrix().getId();
        this.grandPrixName = result.getGrandPrix().getName();
        this.circuit = result.getGrandPrix().getCircuit();
        this.polePositionDriver = result.getPolePositionDriver();
        this.p1Driver = result.getP1Driver();
        this.p2Driver = result.getP2Driver();
        this.p3Driver = result.getP3Driver();
        this.fastestLapDriver = result.getFastestLapDriver();
    }

    // геттеры и сеттеры
    public Long getGrandPrixId() { return grandPrixId; }
    public void setGrandPrixId(Long grandPrixId) { this.grandPrixId = grandPrixId; }
    public String getGrandPrixName() { return grandPrixName; }
    public void setGrandPrixName(String grandPrixName) { this.grandPrixName = grandPrixName; }
    public String getCircuit() { return circuit; }
    public void setCircuit(String circuit) { this.circuit = circuit; }
    public String getPolePositionDriver() { return polePositionDriver; }
    public void setPolePositionDriver(String polePositionDriver) { this.polePositionDriver = polePositionDriver; }
    public String getP1Driver() { return p1Driver; }
    public void setP1Driver(String p1Driver) { this.p1Driver = p1Driver; }
    public String getP2Driver() { return p2Driver; }
    public void setP2Driver(String p2Driver) { this.p2Driver = p2Driver; }
    public String getP3Driver() { return p3Driver; }
    public void setP3Driver(String p3Driver) { this.p3Driver = p3Driver; }
    public String getFastestLapDriver() { return fastestLapDriver; }
    public void setFastestLapDriver(String fastestLapDriver) { this.fastestLapDriver = fastestLapDriver; }
}
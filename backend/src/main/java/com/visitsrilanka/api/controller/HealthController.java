package com.visitsrilanka.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Verification endpoint only — confirms the API boots and the frontend
 * can reach it. Real domain controllers (DestinationController,
 * HotelController, etc.) land in Phase 3 once the data model is defined.
 */
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "ok",
                "service", "visit-sri-lanka-api",
                "timestamp", Instant.now().toString()
        );
    }
}

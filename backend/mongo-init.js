// MongoDB initialization script
db = db.getSiblingDB('travel_planner');

// Create collections
db.createCollection('users');
db.createCollection('trips');
db.createCollection('activities');
db.createCollection('feedback');
db.createCollection('feedback_replies');
db.createCollection('feedback_votes');
db.createCollection('improvement_suggestions');
db.createCollection('map_locations');
db.createCollection('user_locations');
db.createCollection('trip_messages');
db.createCollection('emergency_alerts');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "created_at": 1 });

db.trips.createIndex({ "user_id": 1 });
db.trips.createIndex({ "destination": 1 });
db.trips.createIndex({ "start_date": 1 });
db.trips.createIndex({ "status": 1 });
db.trips.createIndex({ "created_at": 1 });

db.activities.createIndex({ "trip_id": 1 });
db.activities.createIndex({ "day": 1 });
db.activities.createIndex({ "type": 1 });

// Enhanced feedback indexes
db.feedback.createIndex({ "user_id": 1 });
db.feedback.createIndex({ "trip_id": 1 });
db.feedback.createIndex({ "feedback_type": 1 });
db.feedback.createIndex({ "status": 1 });
db.feedback.createIndex({ "priority": 1 });
db.feedback.createIndex({ "category": 1 });
db.feedback.createIndex({ "language": 1 });
db.feedback.createIndex({ "created_at": 1 });
db.feedback.createIndex({ "rating": 1 });
db.feedback.createIndex({ "tags": 1 });

// Feedback replies indexes
db.feedback_replies.createIndex({ "feedback_id": 1 });
db.feedback_replies.createIndex({ "user_id": 1 });
db.feedback_replies.createIndex({ "created_at": 1 });

// Feedback votes indexes
db.feedback_votes.createIndex({ "feedback_id": 1 });
db.feedback_votes.createIndex({ "user_id": 1 });
db.feedback_votes.createIndex({ "feedback_id": 1, "user_id": 1 }, { unique: true });

// Improvement suggestions indexes
db.improvement_suggestions.createIndex({ "feedback_id": 1 });
db.improvement_suggestions.createIndex({ "suggestion_type": 1 });
db.improvement_suggestions.createIndex({ "status": 1 });
db.improvement_suggestions.createIndex({ "priority": 1 });
db.improvement_suggestions.createIndex({ "created_at": 1 });

db.map_locations.createIndex({ "location": "2dsphere" });
db.map_locations.createIndex({ "category": 1 });

db.user_locations.createIndex({ "user_id": 1 });
db.user_locations.createIndex({ "trip_id": 1 });
db.user_locations.createIndex({ "timestamp": 1 });

db.trip_messages.createIndex({ "trip_id": 1 });
db.trip_messages.createIndex({ "timestamp": 1 });

db.emergency_alerts.createIndex({ "trip_id": 1 });
db.emergency_alerts.createIndex({ "timestamp": 1 });

print('Database initialized successfully with enhanced feedback system!');

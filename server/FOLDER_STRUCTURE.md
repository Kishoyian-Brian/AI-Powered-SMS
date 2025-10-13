# Server Folder Structure

```
server/
├── prisma/
│   ├── schema.prisma              # Database schema (✓ completed)
│   ├── migrations/                # Database migrations
│   └── seed.ts                    # Database seeding script
│
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   │
│   ├── config/                    # Configuration files
│   │   ├── database.config.ts     # Database configuration
│   │   ├── jwt.config.ts          # JWT configuration
│   │   └── app.config.ts          # General app configuration
│   │
│   ├── common/                    # Shared utilities
│   │   ├── decorators/            # Custom decorators
│   │   │   ├── roles.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   │
│   │   ├── guards/                # Guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── local-auth.guard.ts
│   │   │
│   │   ├── interceptors/          # Interceptors
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   │
│   │   ├── filters/               # Exception filters
│   │   │   ├── http-exception.filter.ts
│   │   │   └── prisma-exception.filter.ts
│   │   │
│   │   ├── pipes/                 # Custom pipes
│   │   │   └── validation.pipe.ts
│   │   │
│   │   └── types/                 # Common types
│   │       ├── user-payload.type.ts
│   │       └── pagination.type.ts
│   │
│   ├── database/                  # Database module
│   │   ├── database.module.ts
│   │   └── prisma.service.ts      # Prisma service singleton
│   │
│   ├── auth/                      # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── auth-response.dto.ts
│   │
│   ├── users/                     # Users module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── interfaces/
│   │       └── user.interface.ts
│   │
│   ├── admins/                    # Admins module
│   │   ├── admins.module.ts
│   │   ├── admins.controller.ts
│   │   ├── admins.service.ts
│   │   ├── dto/
│   │   │   ├── create-admin.dto.ts
│   │   │   └── update-admin.dto.ts
│   │   └── interfaces/
│   │       └── admin.interface.ts
│   │
│   ├── students/                  # Students module
│   │   ├── students.module.ts
│   │   ├── students.controller.ts
│   │   ├── students.service.ts
│   │   ├── dto/
│   │   │   ├── create-student.dto.ts
│   │   │   ├── update-student.dto.ts
│   │   │   └── student-query.dto.ts
│   │   └── interfaces/
│   │       └── student.interface.ts
│   │
│   ├── teachers/                  # Teachers module
│   │   ├── teachers.module.ts
│   │   ├── teachers.controller.ts
│   │   ├── teachers.service.ts
│   │   ├── dto/
│   │   │   ├── create-teacher.dto.ts
│   │   │   └── update-teacher.dto.ts
│   │   └── interfaces/
│   │       └── teacher.interface.ts
│   │
│   ├── classes/                   # Classes module
│   │   ├── classes.module.ts
│   │   ├── classes.controller.ts
│   │   ├── classes.service.ts
│   │   ├── dto/
│   │   │   ├── create-class.dto.ts
│   │   │   ├── update-class.dto.ts
│   │   │   └── assign-teacher.dto.ts
│   │   └── interfaces/
│   │       └── class.interface.ts
│   │
│   ├── attendance/                # Attendance module
│   │   ├── attendance.module.ts
│   │   ├── attendance.controller.ts
│   │   ├── attendance.service.ts
│   │   ├── dto/
│   │   │   ├── mark-attendance.dto.ts
│   │   │   ├── bulk-attendance.dto.ts
│   │   │   └── attendance-query.dto.ts
│   │   └── interfaces/
│   │       └── attendance.interface.ts
│   │
│   ├── assignments/               # Assignments module
│   │   ├── assignments.module.ts
│   │   ├── assignments.controller.ts
│   │   ├── assignments.service.ts
│   │   ├── dto/
│   │   │   ├── create-assignment.dto.ts
│   │   │   ├── update-assignment.dto.ts
│   │   │   ├── submit-assignment.dto.ts
│   │   │   └── grade-assignment.dto.ts
│   │   └── interfaces/
│   │       ├── assignment.interface.ts
│   │       └── student-assignment.interface.ts
│   │
│   ├── grades/                    # Grades module
│   │   ├── grades.module.ts
│   │   ├── grades.controller.ts
│   │   ├── grades.service.ts
│   │   ├── dto/
│   │   │   ├── create-grade.dto.ts
│   │   │   └── update-grade.dto.ts
│   │   └── interfaces/
│   │       └── grade.interface.ts
│   │
│   ├── reports/                   # Reports module
│   │   ├── reports.module.ts
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   ├── dto/
│   │   │   ├── generate-report.dto.ts
│   │   │   └── report-query.dto.ts
│   │   ├── interfaces/
│   │   │   └── report.interface.ts
│   │   └── generators/            # Report generators
│   │       ├── monthly-report.generator.ts
│   │       ├── attendance-report.generator.ts
│   │       └── performance-report.generator.ts
│   │
│   └── ai/                        # AI Assistant module
│       ├── ai.module.ts
│       ├── ai.controller.ts
│       ├── ai.service.ts
│       ├── dto/
│       │   ├── chat.dto.ts
│       │   ├── generate-insights.dto.ts
│       │   └── analyze-performance.dto.ts
│       ├── interfaces/
│       │   ├── chat-message.interface.ts
│       │   └── ai-insight.interface.ts
│       └── processors/            # AI processors
│           ├── chat.processor.ts
│           ├── insights.processor.ts
│           └── performance-analyzer.processor.ts
│
├── test/                          # E2E tests
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   ├── students.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env                           # Environment variables
├── .env.example                   # Environment variables template
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

## Module Structure Pattern

Each module follows this pattern:

```
module-name/
├── module-name.module.ts          # Feature module definition
├── module-name.controller.ts      # REST API endpoints
├── module-name.service.ts         # Business logic
├── dto/                           # Data Transfer Objects
│   ├── create-*.dto.ts           # Creation DTOs
│   ├── update-*.dto.ts           # Update DTOs
│   └── query-*.dto.ts            # Query/filter DTOs
└── interfaces/                    # TypeScript interfaces (extends Prisma types)
    └── *.interface.ts            # Interface definitions
```

## Key Principles

### 1. **Separation of Concerns**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **DTOs**: Define data shapes for input/output
- **Interfaces**: Custom types that extend Prisma-generated types

### 2. **Module Independence**
- Each feature is a self-contained module
- Modules can import other modules when needed
- Common functionality in `/common`

### 3. **Security**
- Guards for authentication & authorization
- Decorators for route protection
- JWT strategy for token validation

### 4. **Database (Prisma)**
- Centralized Prisma service
- Database module imported by all feature modules
- Type-safe database queries with auto-generated types
- Interfaces extend Prisma types for custom properties

### 5. **Validation**
- DTOs with class-validator decorators
- Global validation pipe
- Custom validation rules when needed

## Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sms_db?schema=public"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# App
PORT=3000
NODE_ENV="development"

# AI (Optional - for AI features)
OPENAI_API_KEY="your-openai-key"
```

## Next Steps

1. ✅ Prisma schema completed
2. ⏳ Create database service (`prisma.service.ts`)
3. ⏳ Setup authentication module
4. ⏳ Implement feature modules (students, teachers, classes, etc.)
5. ⏳ Add guards and decorators
6. ⏳ Implement AI service
7. ⏳ Add validation and error handling
8. ⏳ Write tests

---

**Note**: This structure follows NestJS best practices and is scalable for future features.


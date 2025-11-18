"""Data validation utilities for editing operations."""

import re
from typing import Any, List, Optional, Dict
from datetime import datetime, date
from decimal import Decimal, InvalidOperation
from ..core.data_editor import CellChange, ColumnInfo, ValidationError


class DataValidator:
    """Validates data changes against database constraints."""
    
    @staticmethod
    def validate_cell_change(change: CellChange, column_info: ColumnInfo) -> List[str]:
        """Validate a cell change against column constraints."""
        errors = []
        
        # Null validation
        if change.new_value is None or change.new_value == '':
            if not column_info.is_nullable:
                errors.append(f"Column '{change.column}' cannot be null")
            return errors
        
        # Type validation
        type_errors = DataValidator._validate_data_type(
            change.new_value, column_info.data_type, column_info
        )
        errors.extend(type_errors)
        
        # Length validation
        if column_info.max_length:
            length_errors = DataValidator._validate_length(
                change.new_value, column_info.max_length
            )
            errors.extend(length_errors)
        
        return errors
    
    @staticmethod
    def _validate_data_type(value: Any, data_type: str, column_info: ColumnInfo) -> List[str]:
        """Validate value against data type."""
        errors = []
        data_type_lower = data_type.lower()
        
        try:
            if 'int' in data_type_lower or 'serial' in data_type_lower:
                int(value)
            
            elif 'float' in data_type_lower or 'double' in data_type_lower or 'real' in data_type_lower:
                float(value)
            
            elif 'decimal' in data_type_lower or 'numeric' in data_type_lower:
                decimal_val = Decimal(str(value))
                if column_info.numeric_precision:
                    # Check precision and scale
                    sign, digits, exponent = decimal_val.as_tuple()
                    if len(digits) > column_info.numeric_precision:
                        errors.append(f"Value exceeds precision of {column_info.numeric_precision}")
            
            elif 'bool' in data_type_lower:
                if str(value).lower() not in ('true', 'false', '1', '0', 't', 'f'):
                    errors.append("Invalid boolean value")
            
            elif 'date' in data_type_lower:
                if 'time' in data_type_lower:
                    # datetime
                    datetime.fromisoformat(str(value).replace('Z', '+00:00'))
                else:
                    # date only
                    datetime.strptime(str(value), '%Y-%m-%d').date()
            
            elif 'time' in data_type_lower:
                datetime.strptime(str(value), '%H:%M:%S').time()
            
            elif 'json' in data_type_lower:
                import json
                json.loads(str(value))
            
            elif 'uuid' in data_type_lower:
                import uuid
                uuid.UUID(str(value))
            
            elif 'email' in data_type_lower:
                email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
                if not re.match(email_pattern, str(value)):
                    errors.append("Invalid email format")
        
        except (ValueError, InvalidOperation, TypeError) as e:
            errors.append(f"Invalid {data_type}: {str(e)}")
        
        return errors
    
    @staticmethod
    def _validate_length(value: Any, max_length: int) -> List[str]:
        """Validate string length."""
        errors = []
        str_value = str(value)
        
        if len(str_value) > max_length:
            errors.append(f"Value length ({len(str_value)}) exceeds maximum ({max_length})")
        
        return errors
    
    @staticmethod
    async def validate_foreign_key(value: Any, referenced_table: str, referenced_column: str, 
                                  connector) -> List[str]:
        """Validate foreign key constraint by checking referenced table."""
        errors = []
        
        if value is None:
            return errors  # NULL is valid for FK unless NOT NULL constraint
        
        if str(value).strip() == '':
            errors.append("Foreign key cannot be empty string")
            return errors
        
        try:
            # Check if referenced value exists
            query = f"SELECT 1 FROM {referenced_table} WHERE {referenced_column} = %s LIMIT 1"
            result = await connector.execute_query(query.replace('%s', f"'{value}'"))
            
            if not result:
                errors.append(f"Referenced value '{value}' not found in {referenced_table}.{referenced_column}")
        
        except Exception as e:
            errors.append(f"Foreign key validation failed: {str(e)}")
        
        return errors
    
    @staticmethod
    def sanitize_value(value: Any, data_type: str) -> Any:
        """Sanitize and convert value to appropriate type."""
        if value is None or value == '':
            return None
        
        data_type_lower = data_type.lower()
        
        try:
            if 'int' in data_type_lower or 'serial' in data_type_lower:
                return int(value)
            
            elif 'float' in data_type_lower or 'double' in data_type_lower or 'real' in data_type_lower:
                return float(value)
            
            elif 'decimal' in data_type_lower or 'numeric' in data_type_lower:
                return Decimal(str(value))
            
            elif 'bool' in data_type_lower:
                return str(value).lower() in ('true', '1', 't', 'yes', 'on')
            
            else:
                return str(value)
        
        except (ValueError, InvalidOperation):
            return str(value)  # Fallback to string